#!/bin/bash

# CEO_FILTER_GEN.sh
: Description: Create special regex content filters to prevent CEO display-name spoofing on ESG and ESS.
: Author: Zachary Puhl
: Contact: zpuhl@barracuda.com // postmaster@yeethop.xyz
: Date: 28 February, 2019
: Product: Email Security Gateway, Email Security Service
: Firmware: -ESG- 8.1.0.003, -ESS- 2019.1
####################

###################################################
#Declare initial functions to simplify main script.

# usage:
# Display the usage information of the script.
function usage() {
  echo "USAGE: $0 \"CEO-Name\" [OPTIONS]..."
  echo "Generate an ESG/ESS-compliant regular expression for a Display Name"
  echo "  in the \"From:\" header of an email. This regex, by default, will"
  echo "  match the name given, as well as typo-squatting variations of the"
  echo "  name."
  echo -e "CEO-Name: The CEO-Name field should be from FIRST to LAST name.\n"
  echo "OPTIONS:"
  echo -e "   -e    Match all From headers EXCEPT those with the given email."
  echo -e "   -i    Generate a NON-case-sensitive variant (shortens it).\n"
  echo "EXAMPLES:"
  echo "    $0 \"John F. Smith\" -i -e\"jsmith@example.com\""
  echo "        Will generate a regex for variations of the above name like:"
  echo "        \"Smith, Jon F\" & \"Johnathan Smith\""
  echo "        This will EXEMPT matching any From headers including the given"
  echo "        email address, assuming content filters support look-aheads."
  printf "\n"
  exit 1
}

# Set initial state. Ensure relevant variables are not defined.
ORIG_NAME=
NAME=
ORIG_FIRST_NAME=
FIRST_NAME=
ORIG_MIDDLE_NAME=
MIDDLE_NAME=
ORIG_LAST_NAME=
LAST_NAME=
REGEX=
CASE_INSENSITIVE=
LOOK_AHEAD_ADDRESS=

# Set up colors, if they're supported by the current terminal.
COLORS=$(tput colors 2>/dev/null)
if [ -n "$COLORS" ]; then
    TC_RED=`tput setaf 1 2>/dev/null`
    TC_GREEN=`tput setaf 2 2>/dev/null`
    TC_YELLOW=`tput setaf 3 2>/dev/null`
    TC_BLUE=`tput setaf 4 2>/dev/null`
    TC_CYAN=`tput setaf 6 2>/dev/null`
    TC_NORMAL=`tput sgr0 2>/dev/null`
    TC_BOLD=`tput bold 2>/dev/null`
fi

# Quick checks for usage requests, or other failures.
[[ -z $1 || "$1" =~ ^\-.*$ ]] && usage || NAME="$1"
[[ -n $2 && ! "$2" =~ ^\-.*$ ]] \
  && echo "${TC_BOLD}${TC_RED}ERROR${TC_NORMAL}: $0: You need to quote the name!" && exit 1

# Quickly save arg1 before the shift below.
ORIG_NAME="${NAME}"

# Roll the "CEO-Name" field off the arguments.
shift

# Parse arguments and flags. At this time it's pretty minimal.
while getopts ie: param; do
  case $param in
    i) CASE_INSENSITIVE="TRUE" ;;
    e) LOOK_AHEAD_ADDRESS="${OPTARG}" ;;
    *) usage ;;
  esac
done

#Make sure the look-ahead variable/arg is an email address.
if [[ -n "${LOOK_AHEAD_ADDRESS}" ]]; then
  if [[ ! "${LOOK_AHEAD_ADDRESS}" =~ ^[a-zA-Z0-9\+\-_\.=%]+\@[a-zA-Z0-9\.\-]+\.[a-zA-Z0-9]{2,}$ ]]; then
    echo "${TC_BOLD}${TC_RED}ERROR${TC_NORMAL}: $0: Invalid option for -e flag, needs to be a valid email address."
    exit 2
  fi
fi

# Strip some special characters (like .). Might add to this SED later.
NAME=$(echo "$NAME" | sed -r 's/\.//g')

# First Name will go all the way up to the last word in the name. (Initally includes the middle name)
FIRST_NAME=$(echo "$NAME" | sed -r 's/\s+[a-zA-Z\-\.]+\s*$//g')
# Last Name will be the last word after the final space.
LAST_NAME=$(echo "$NAME" | grep -Poi '[a-zA-Z\-\.]+\s*$')
# Save the original last name.
ORIG_LAST_NAME="${LAST_NAME}"


# If there's a Middle Name (or initial), set it up here.
# NOTE: The generated regex makes the middle name entirely optional.
MIDDLE_NAME=$(echo "${NAME}" | sed -r 's/^[a-zA-Z\-\.]+\s+//' | sed -r 's/\s*[a-zA-Z\-\.]+\s*$//')
# Save the caught Middle Name for later...
ORIG_MIDDLE_NAME="${MIDDLE_NAME}"

# If there's a middle name, chop off the first Character to see whether or not it's
#   just an initial. Remember that by this time, any '.' characters are stripped.
if [ -n "$MIDDLE_NAME" ]; then
  MIDDLE_NAME_PARTICLE=$(echo "${MIDDLE_NAME:1:`echo ${#MIDDLE_NAME}`}")
  if [ -n "$MIDDLE_NAME_PARTICLE" ]; then
    # If there is more than just an initial, set up the middle name to be both full or initial.
    # EXAMPLE: "Tracy" --> Particle="racy" --> New MIDDLE_NAME = T(\.|racy)? to cover T., T, or Tracy
    MIDDLE_NAME="( ${MIDDLE_NAME:0:1}(\.|${MIDDLE_NAME_PARTICLE})?)?"
  else
    # Otherwise, the middle name becomes the initial with an optional . character
    MIDDLE_NAME="( ${MIDDLE_NAME}\.?)?"
  fi
fi

# Now that the middle name is sorted, discard it from the FIRST_NAME variable.
# ... And save it for later.
FIRST_NAME=$(echo "${FIRST_NAME}" | cut -d' ' -f1)
ORIG_FIRST_NAME="${FIRST_NAME}"

# Get a temp var and set it to all lower-case (for ease of regex comparison)
FIRST_NAME_PARSE=$(echo "${FIRST_NAME}" | tr '[:upper:]' '[:lower:]')

# Since first names take many different forms and shapes, account for them.
# !!!!!!!!!!!!!!!!!!!!!
# NOTE: These custom rules CANNOT have an e,i,l,o,t, or s in between a []
#     because it will later expand to that substitution in the final steps.
#     So, regexes are intentionally a bit sloppy here (;
# !!!!!!!!!!!!!!!!!!!!!
if [[ "${FIRST_NAME_PARSE}" =~ ^joh?n(athan|athon|ny|nie)? ]]; then
  FIRST_NAME="J(\.|oh?n(athan|athon|ny|nie)?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^dan(n(y|ie)|iel)? ]]; then
  FIRST_NAME="D(\.|an(n(y|ie)|iel)?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^zac(k|[kh][ae]ry)? ]]; then
  FIRST_NAME="Z(\.|ac(k|[kh](ery|ary))?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^(bob(b?(y|ie))?|(rob(ert|b?(y|ie))?)) ]]; then
  FIRST_NAME="(((B|R)\.?)|Bob(b?(y|ie))?|Rob(ert|b?(y|ie))?)${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^th?om(as|m?(y|ie))? ]]; then
  FIRST_NAME="T(\.|h?om(as|m?(y|ie))?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^([bw]ill(iam|y|ie)?) ]]; then
  FIRST_NAME="(B|W)(\.|ill(iam|y|ie)?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^al(ice|lison|l?ie) ]]; then
  FIRST_NAME="A(\.|l(ice|lison|l?ie))?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^e?li(za(beth)?|sa|zz?(y|ie)) ]]; then
  FIRST_NAME="E?li(za(beth)?|sa|zz?(y|ie)?)${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^ste(v|ph)en? ]]; then
  FIRST_NAME="S(\.|te(v|ph)en?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^s(hawn|ean) ]]; then
  FIRST_NAME="S(\.|hawn|ean)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^dav(e|id) ]]; then
  FIRST_NAME="D(\.|av(e|id))?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^greg(ory)? ]]; then
  FIRST_NAME="G(\.|reg(ory)?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^don(ald|n?(y|ie))? ]]; then
  FIRST_NAME="D(\.|on(ald|n?(y|ie))?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^ron(ald|n?(y|ie))? ]]; then
  FIRST_NAME="R(\.|on(ald|n?(y|ie))?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^(miriam|mar(ie|y|iam)) ]]; then
  FIRST_NAME="M(\.|(i|a)riam|y|ie)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^mi(cha?el|key?) ]]; then
  FIRST_NAME="M(\.|i(key?|cha?el))?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^mat(t?hew)? ]]; then
  FIRST_NAME="M(\.|at(t?hew)?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^ken(n?(y|ie|eth))? ]]; then
  FIRST_NAME="K(\.|en(n?(y|ie|eth))?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^ric[hk]?(ardo?|ie)? ]]; then
  FIRST_NAME="R(\.|ic[hk]?(ardo?|ie)?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^m(oe?|(u|o)hamm?(a|e|u|i)(d|t)) ]]; then
  FIRST_NAME="M(\.|oe?|(u|o)hamm?(a|u|e|i)(d|t))?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^jo(s?e(y|ph)?)? ]]; then
  FIRST_NAME="J(\.|o(s?e(y|ph)?)?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^sam(uel|m?(ie|y)|antha)? ]]; then
  # This one might be dangerous as a unisex name. If "Samuel Smith" is intended to be
  #  blocked, this might also block "Samantha Smith". Leaving for now.
  FIRST_NAME="S(\.|am(uel|m?(ie|y)|antha)?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^jess((e|i)ca|y|ie)? ]]; then
  FIRST_NAME="J(\.|ess((e|i)ca|y|ie)?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^(an)?th?o(ine|n(ie|y)) ]]; then
  FIRST_NAME="(An|T)(\.|h?o(ine|n(ie|y)))?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^and(y|ie|rew) ]]; then
  FIRST_NAME="A(\.|nd(y|ie|rew))?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^br(i|e)e?(ann?a)? ]]; then
  FIRST_NAME="B(\.|r(i|e)e?(ann?a)?)?${MIDDLE_NAME}"
else
  # Since it matches no names in our index above, set it with the generic pattern:
  #    ${FIRST_NAME:0:1}(\.|${FIRST_NAME:1:strlen(FIRST_NAME)}) ---> Example: E(\.|ric)?
  FIRST_NAME_PARTICLE=$(echo "${FIRST_NAME:1:`echo ${#FIRST_NAME}`}")
  FIRST_NAME="${FIRST_NAME:0:1}(\.|${FIRST_NAME_PARTICLE})?"
  # Now combine it with the MIDDLE_NAME, if any.
  FIRST_NAME="${FIRST_NAME}${MIDDLE_NAME}"
fi


# Build a version of the regex that will catch the name in the formal and informal pattern.
#   So, match both: "John H. Smith" and "Smith, John H." formats.
NAME="(${FIRST_NAME} ${LAST_NAME})|(${LAST_NAME},? ${FIRST_NAME})"


# Scan the string now and condense similar chars into a regex quantity operator.
# EXAMPLE: The name William. This will hit the 'i' and then look ahead until the last
#     consecutive 'i' or 'l', once it sees 4 of the chars consecutively, it will drop in
#     a {3,5} into the string. The NEXT STEP will remove all the extras from the string
#     and condense them into a single character properly.
for (( i=0 ; i<`echo ${#NAME}` ; i++ )); do
  if [[ "${NAME:$i:1}" =~ [IiLl] ]]; then
    # This conditional is probably not necessary here...
    for (( j=1 ; ; j++ )); do
      if [[ ! "${NAME:($i+$j):1}" =~ [IiLl] ]]; then
        if [[ $j -gt 1 ]]; then
          # Create a tolerance of one-less and one-more for special characters.
          #   EXAMPLE: Ellie ---> E[iIlL1]{2,4}e
          NAME="${NAME:0:$i+1}{`expr $j - 1`,`expr $j + 1`}${NAME:$i+$j:`echo ${#NAME}`}"
          # Increment the string "pointer" forward to account for the addition of the quantifier.
          i=`expr $i + $j + 3`
          break
        else break; fi
      fi
    done
# The rest of these NEED to be condensed with the quantity operator because they will later
#    be substituted with a SINGLE [.] representation, so the quantity is needed if there's 2.
# EXAMPLE: Jassa -> Jas{1,3}a ---> Once this is crunched through final SED step: Ja[Ss5]{1,3}a
  elif [[ "${NAME:$i:1}" =~ [Ee] ]]; then
    if [[ "${NAME:$i+1:1}" =~ [Ee] ]]; then
      NAME="${NAME:0:$i+1}{1,3}${NAME:$i+2:`echo ${#NAME}`}"
      i=`expr $i + 5`
    else continue;fi
  elif [[ "${NAME:$i:1}" =~ [Ss] ]]; then
    if [[ "${NAME:$i+1:1}" =~ [Ss] ]]; then
      NAME="${NAME:0:$i+1}{1,3}${NAME:$i+2:`echo ${#NAME}`}"
      i=`expr $i + 5`
    else continue; fi
  elif [[ "${NAME:$i:1}" =~ [Tt] ]]; then
    if [[ "${NAME:$i+1:1}" =~ [Tt] ]]; then
      NAME="${NAME:0:$i+1}{1,3}${NAME:$i+2:`echo ${#NAME}`}"
      i=`expr $i + 5`
    else continue; fi
  elif [[ "${NAME:$i:1}" =~ [Oo] ]]; then
    if [[ "${NAME:$i+1:1}" =~ [Oo] ]]; then
      NAME="${NAME:0:$i+1}{1,3}${NAME:$i+2:`echo ${#NAME}`}"
      i=`expr $i + 5`
    else continue; fi
  elif [[ "${NAME:$i:1}" =~ [Bb] ]]; then
    if [[ "${NAME:$i+1:1}" =~ [Bb] ]]; then
      NAME="${NAME:0:$i+1}{1,3}${NAME:$i+2:`echo ${#NAME}`}"
      i=`expr $i + 5`
    else continue; fi
  fi
done

# All the name needs is a TR or a SED to replace typosquats.
# 1: Replace I/i/L/l with the typosquatting characters.
# 2: Replace E/e with the typosquatting characters.
# 3: Replace S/S with the typosquatting characters.
# 4: Replace T/t with the typosquatting characters.
# 5: Replace O/o with the typosquatting characters.
# 6: Replace B/b with the typosquatting characters.
# 7: Replace ' ' (spaces between the name) with '\s+' (one + spaces).
# 8: Finish the parenthesis, the double-quotes, and add the portion to match the From header.
if [[ -z "$CASE_INSENSITIVE" ]]; then
  REGEX=$(printf "${NAME}" | sed -r 's/[IiLl]+/\[IiLl1\]/g' \
    | sed -r 's/[Ee]+/\[Ee3\]/g' \
    | sed -r 's/[Ss]+/\[Ss5\]/g' \
    | sed -r 's/[Tt]+/\[Tt7\]/g' \
    | sed -r 's/[Oo]+/\[Oo0\]/g' \
    | sed -r 's/[Bb]+/\[Bb8\]/g' \
    | sed -r 's/\s+/\\s\+/g' \
    | sed -r 's/^/From\:\\s\*"\?\\s\*\(/g' | sed -r 's/$/\)\\s\*"\?\\s\+\</g')
else
  REGEX=$(printf "${NAME}" | sed -r 's/[IiLl]+/\[il1\]/g' \
    | sed -r 's/[Ee]+/\[e3\]/g' \
    | sed -r 's/[Ss]+/\[s5\]/g' \
    | sed -r 's/[Tt]+/\[t7\]/g' \
    | sed -r 's/[Oo]+/\[o0\]/g' \
    | sed -r 's/[Bb]+/\[b8\]/g' \
    | sed -r 's/\s+/\\s\+/g' \
    | sed -r 's/^/From\:\\s\*"\?\\s\*\(/g' | sed -r 's/$/\)\\s\*"\?\\s\+\</g')
fi

# If the look-ahead address is defined (the CEO's real email address) append it.
#   This regex assumes that the content filtering system of the spam filter supports look-ahead operators.
if [[ -n "${LOOK_AHEAD_ADDRESS}" ]]; then
  LOOK_AHEAD_ADDRESS=$(echo "${LOOK_AHEAD_ADDRESS}" | sed -r 's/\./\\\./g' | sed -r 's/\-/\\-/g' | sed -r 's/\+/\\+/g')
  REGEX="${REGEX}(?!${LOOK_AHEAD_ADDRESS}\>\s*$)"
fi


# Everything is done, output the final result and other information.
echo "Regex successfully generated for name \"${TC_CYAN}${ORIG_NAME}${TC_NORMAL}\"!"
echo -e "Please enter this into the content filters section of an ${TC_GREEN}ESG/ESS${TC_NORMAL} for ${TC_YELLOW}headers${TC_NORMAL}.\n"
echo "${REGEX}"
[[ -n "${LOOK_AHEAD_ADDRESS}" ]] && \
echo -e "\n${TC_BOLD}${TC_BLUE}WARNING${TC_NORMAL}: The above regex uses LOOK-AHEAD operators, which ${TC_RED}ARE NOT BARRACUDA-COMPATIBLE${TC_NORMAL}!!! \
If your spam filtering service doesn't support these operators, this will ${TC_BOLD}invalidate${TC_NORMAL} the regex entirely."
echo -e "\nFor confidence, test the Regex here: ${TC_RED}https://regoio.herokuapp.com/${TC_NORMAL}"
echo -e "${TC_BOLD}PLEASE NOTE: THE TESTER ABOVE IS CASE-SENSITIVE!!!${TC_NORMAL}\n"
echo "Try out some of these examples in the tester above and mutate them as you please:"
echo "    From: `echo ${ORIG_LAST_NAME} | sed -r 's/[bB]/8/g'`, ${ORIG_FIRST_NAME} ${ORIG_MIDDLE_NAME} <fake@fake.com>"
echo "    From: \"`echo ${ORIG_FIRST_NAME} | sed 's/[oO]/0/g' | sed 's/[iIlL]/1/g'` ${ORIG_LAST_NAME}  \" <test@notexist.net>"
echo "    From:\"${ORIG_LAST_NAME} ${ORIG_FIRST_NAME} <${ORIG_FIRST_NAME:0:1}${ORIG_LAST_NAME}@legit.domain.com>\" <spammer@badguys.com>"
exit 0
