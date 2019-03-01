#!/bin/bash

# DEFER_INFO.sh
: Description: Create special regex content filters to prevent CEO display-name spoofing on ESG and ESS.
: Author: Zachary Puhl
: Contact: zpuhl@barracuda.com // postmaster@yeethop.xyz
: Date: 28 February, 2019
: Product: Email Security Gateway, Email Security Service
: Firmware: -ESG- 8.1.0.003, -ESS- 2019.1
###############

###################################################
#Declare initial functions to simplify main script.

function usage() {
  echo "USAGE: $0 \"CEO-Name\" [OPTIONS]..."
  echo "Generate an ESG/ESS-compliant regular expression for a Display Name"
  echo "  in the \"From:\" header of an email. This regex, by default, will"
  echo "  match the name given, as well as typo-squatting variations of the"
  echo "  name."
  echo -e "CEO-Name: The CEO-Name field should be from FIRST to LAST name.\n"
  echo "OPTIONS:"
  echo -e "   -c    Make the regex case-sensitive.\n"
  echo "EXAMPLES:"
  echo "    $0 \"John F. Smith\" -c"
  echo "        Will generate a regex for variations of the above name like:"
  echo "        \"Smith, Jon F\" & \"Johnathan Smith\""
  printf "\n"
  exit 1
}

# Set initial state.
ORIG_NAME=
NAME=
FIRST_NAME=
LAST_NAME=
REGEX=
CASE_INSENSITIVE="TRUE"

# Quick checks for usage requests, or other failures.
[[ -z $1 || "$1" =~ ^\-.*$ ]] && usage || NAME="$1"
[[ -n $2 && ! "$2" =~ ^-.*$ ]] && echo "ERROR: $0: You need to quote the name!" && exit 1

# Quickly save arg1 before the shift below.
ORIG_NAME="${NAME}"

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

# Roll the "CEO-Name" field off the arguments.
shift

# Parse arguments and flags.
while getopts c param; do
  case $param in
    c) CASE_INSENSITIVE=
    ;;
    *) usage ;;
  esac
done

# Strip some special characters (like .)
NAME=$(echo "$NAME" | sed -r 's/\.//g')

# First Name will go all the way up to the last word in the name. (Initally includes the middle name)
FIRST_NAME=$(echo "$NAME" | sed -r 's/\s+[a-zA-Z\-\.]+\s*$//g')
# Last Name will be the last word after the final space.
LAST_NAME=$(echo "$NAME" | grep -Poi '[a-zA-Z\-\.]+\s*$')



# If there's a Middle Name (or initial), set it up here.
# NOTE: The generated regex makes the middle name entirely optional.
MIDDLE_NAME=$(echo "${NAME}" | sed -r 's/^[a-zA-Z\-\.]+\s+//' | sed -r 's/\s*[a-zA-Z\-\.]+\s*$//')

if [ -n "$MIDDLE_NAME" ]; then
  MIDDLE_NAME_PARTICLE=$(echo "${MIDDLE_NAME:1:`echo ${#MIDDLE_NAME}`}")
  if [ -n "$MIDDLE_NAME_PARTICLE" ]; then
    MIDDLE_NAME=" (${MIDDLE_NAME:0:1}(\.|${MIDDLE_NAME_PARTICLE})?)?"
  else
    MIDDLE_NAME=" (${MIDDLE_NAME}\.?)?"
  fi
fi

# Now that the middle name is sorted, discard it from the FIRST_NAME variable.
FIRST_NAME=$(echo "${FIRST_NAME}" | cut -d' ' -f1)

# Get a temp var and set it to all lower-case (for ease of regex comparison)
FIRST_NAME_PARSE=$(echo "${FIRST_NAME}" | tr '[:upper:]' '[:lower:]')
# Since first names take many different forms and shapes, account for them.
if [[ "${FIRST_NAME_PARSE}" =~ ^joh?n(athan|athon|ny|nie)? ]]; then
  FIRST_NAME="J(\.|oh?n(athan|athon|ny|nie)?)?${MIDDLE_NAME}"
elif [[ "${FIRST_NAME_PARSE}" =~ ^dan(iel)? ]]; then
  FIRST_NAME="D(\.|an(iel)?)?${MIDDLE_NAME}"
else
  # Since it matches no names in our index above, set it with the generic pattern:
  #    (\.|${FIRST_NAME:1:strlen(FIRST_NAME)}) ---> Example: E(\.|ric)?
  FIRST_NAME_PARTICLE=$(echo "${FIRST_NAME:1:`echo ${#FIRST_NAME}`}")
  FIRST_NAME="${FIRST_NAME:0:1}(\.|${FIRST_NAME_PARTICLE})?"
  # Now combine it with the MIDDLE_NAME, if any.
  FIRST_NAME="${FIRST_NAME}${MIDDLE_NAME}"
fi


# Build a version of the regex that will catch the name in the formal and informal pattern.
NAME="(${FIRST_NAME} ${LAST_NAME})|(${LAST_NAME},? ${FIRST_NAME})"


# Scan the string now and condense similar chars from the first 5 below.
# THE BELOW FOR LOOP IS OVERLY-COMPLEX AND COULD BREAK.
# LOGICALLY, MOST NAMES WILL NEVER HAVE MORE THAN A DOUBLE-CHARACTER.
# ^^ Actually, lots of names (like William) will have many for I / L.
for (( i=0 ; i<`echo ${#NAME}` ; i++ )); do
    echo "${NAME:$i:1}"
  if [[ "${NAME:$i:1}" =~ [IiLl] ]]; then
    finish_loop="false"
    for (( j=1 ; finish_loop=="false" ; j++ )); do
      if [[ ! "${NAME:($i+$j):1}" =~ [IiLl] ]]; then
        if [[ j > 2 ]]; then
          NAME="${NAME:0:$i+1}{`expr $j - 1`,`expr $j + 1`}${NAME:$i+$j:`echo ${#NAME}`}"
          finish_loop="true"
          i=`expr $i + $j + 4`
          break
        fi
      fi
    done
  elif [[ "${NAME:$i:1}" =~ [Ee] ]]; then
    if [[ "${NAME:$i+1:1}" =~ [Ee] ]]; then
      NAME="${NAME:0:$i+1}{1,3}${NAME:$i+2:`echo ${#NAME}`}"
      i=`expr $i + 5`
    else
      continue
    fi
  elif [[ "${NAME:$i:1}" =~ [Ss] ]]; then
    if [[ "${NAME:$i+1:1}" =~ [Ss] ]]; then
      NAME="${NAME:0:$i+1}{1,3}${NAME:$i+2:`echo ${#NAME}`}"
      i=`expr $i + 5`
    else
      continue
    fi
  elif [[ "${NAME:$i:1}" =~ [Tt] ]]; then
    if [[ "${NAME:$i+1:1}" =~ [Tt] ]]; then
      NAME="${NAME:0:$i+1}{1,3}${NAME:$i+2:`echo ${#NAME}`}"
      i=`expr $i + 5`
    else
      continue
    fi
  elif [[ "${NAME:$i:1}" =~ [Oo] ]]; then
    if [[ "${NAME:$i+1:1}" =~ [Oo] ]]; then
      NAME="${NAME:0:$i+1}{1,3}${NAME:$i+2:`echo ${#NAME}`}"
      i=`expr $i + 5`
    else
      continue
    fi
  fi
done

# All the name needs is a TR or a SED to replace typosquats.
# 1: Replace i/l/1 with the wildcard for each other.
# 2: Replace e/3 with the wilcard for each other.
# 3: Replace 5/S with the wildcard for each other.
# 4: Replace 7/T with the wilcard for each other.
# 5: Replace 0/o with the wildcard for each other.
# 6: Replace ' ' (spaces between the name) with '\s+' (one + spaces).
# 7: Finish the parenthesis between the spaces and at the names.
# NOTE: These maintain a difference in case because some ESGs will have case-sensitive content filtering.
# TODO: ADD AN OPTION TO MAKE THE REGEX CASE SENSITIVE!
if [[ -z "$CASE_INSENSITIVE" ]]; then
  REGEX=$(printf "${NAME}" | sed -r 's/[IiLl]+/\[IiLl1\]/g' \
    | sed -r 's/[Ee]+/\[Ee3\]/g' \
    | sed -r 's/[Ss]+/\[Ss5\]/g' \
    | sed -r 's/[Tt]+/\[Tt7\]/g' \
    | sed -r 's/[Oo]+/\[Oo0\]/g' \
    | sed -r 's/\s+/\\s\+/g' \
    | sed -r 's/^/From\:\\s\*"\?\\s\*\(/g' | sed -r 's/$/\)\\s\*"\?\\s\+\</g')
else
  REGEX=$(printf "${NAME}" | sed -r 's/[IiLl]+/\[il1\]/g' \
    | sed -r 's/[Ee]+/\[e3\]/g' \
    | sed -r 's/[Ss]+/\[s5\]/g' \
    | sed -r 's/[Tt]+/\[t7\]/g' \
    | sed -r 's/[Oo]+/\[o0\]/g' \
    | sed -r 's/\s+/\\s\+/g' \
    | sed -r 's/^/From\:\\s\*"\?\\s\*\(/g' | sed -r 's/$/\)\\s\*"\?\\s\+\</g')
fi

echo "Regex successfully generated for name \"${TC_CYAN}${ORIG_NAME}${TC_NORMAL}\"!"
echo -e "Please enter this into the content filters section of an ${TC_GREEN}ESG/ESS${TC_NORMAL} for ${TC_YELLOW}headers${TC_NORMAL}.\n"
echo "${REGEX}"
echo -e "\nFor confidence, test the Regex here: ${TC_RED}https://regoio.herokuapp.com/${TC_NORMAL}"
exit 0
