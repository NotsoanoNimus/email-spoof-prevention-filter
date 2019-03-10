import React, { Component } from 'react';

export default class RegexGenerator extends Component {
    constructor(props) {
        super(props);
        this.parseInput = this.parseInput.bind(this);
        this.parseExempts = this.parseExempts.bind(this);
    }

    parseInput(input) {
        if(!input) { return ""; }
        else { input = input.toString().replace(/[\.\-\']/gi, ""); }

        // Capture certain pieces of the name
        let firstName  = input.match(/^\s*[a-z\'-.]+\s+/i).toString().trim();
        let lastName   = input.match(/\s+[a-z\'-.]+\s*$/i).toString().trim();
        let middleName = input.toString().replace(/^\s*[a-z\'-.]+\s+|\s+[a-z\'-.]+\s*$/gi, "").trim();
        if(middleName === lastName) { middleName = ""; }

        if(middleName) {
            if(middleName.substring(1,middleName.length)) {
                middleName = "( "+middleName.substring(0,1)+"(\\.|"+middleName.substring(1,middleName.length)+")?)?"
            } else { middleName = "( "+middleName.substring(0,1)+"\\.?)?"; }
        }

        // Iterate through well-known first-names with various permutations.
        if(firstName.match(/^joh?n(ath(a|o)n|ny|nie)?$/i)) {
            firstName = "J(\\.|oh?n(athan|athon|ny|nie)?)?"+middleName;
        } else if(firstName.match(/^dan(n(y|ie)|iel)?$/i)) {
            firstName = "D(\\.|an(n(y|ie)|iel)?)?"+middleName;
        } else if(firstName.match(/^zac([kh]([ae]ry)?)?$/i)) {
            firstName = "Z(\\.|ac([kh]((e|a)ry)?)?)?"+middleName;
        } else if(firstName.match(/^(bob(b?(y|ie))?|(rob(ert|b?(y|ie))?))$/i)) {
            firstName = "(((B|R)\\.?)|Bob(b?(y|ie))?|Rob(ert|b?(y|ie))?)"+middleName;
        } else if(firstName.match(/^th?om(as|m?(y|ie))?$/i)) {
            firstName = "T(\\.|h?om(as|m?(y|ie))?)?"+middleName;
        } else if(firstName.match(/^([bw]ill(iam|y|ie)?)$/i)) {
            firstName = "(B|W)(\\.|ill(iam|y|ie)?)?"+middleName;
        } else if(firstName.match(/^al(ice|lison|l?ie)$/i)) {
            firstName = "A(\\.|l(ice|lison|l?ie))?"+middleName;
        } else if(firstName.match(/^e?li(za(beth)?|sa|zz?(y|ie))$/i)) {
            firstName = "E?li(za(beth)?|sa|zz?(y|ie)?)"+middleName;
        } else if(firstName.match(/^ste(v|ph)en?$/i)) {
            firstName = "S(\\.|te(v|ph)en?)?"+middleName;
        } else if(firstName.match(/^s(hawn|ean)$/i)) {
            firstName = "S(\\.|hawn|ean)?"+middleName;
        } else if(firstName.match(/^dav(e|id)$/i)) {
            firstName = "D(\\.|av(e|id))?"+middleName;
        } else if(firstName.match(/^greg(ory)?$/i)) {
            firstName = "G(\\.|reg(ory)?)?"+middleName;
        } else if(firstName.match(/^don(ald|n?(y|ie))?$/i)) {
            firstName = "D(\\.|on(ald|n?(y|ie))?)?"+middleName;
        } else if(firstName.match(/^ch?ris(topher)?$/i)) {
            firstName = "C(\\.|h?ris(topher)?)?"+middleName;
        } else if(firstName.match(/^j(am(es|e?y|ie)|im(m(y|ie))?)$/i)) {
            firstName = "J(\\.|am(es|e?y|ie)|im(m(y|ie))?)?"+middleName;
        } else if(firstName.match(/^ch(arl(ie|ee|es)|uck(y|ie)?)$/i)) {
            firstName = "C(\\.|h(arl(ie|ee|es)|uck(y|ie)?))?"+middleName;
        } else if(firstName.match(/^jenn?(y|ifer|ie)?$/i)) {
            firstName = "J(\\.|enn?(y|ie|ifer)?)?"+middleName;
        } else if(firstName.match(/^su(e|sie|san)$/i)) {
            firstName = "S(\\.|u(e|sie|san))?"+middleName;
        } else if(firstName.match(/^deb(b(y|ie)?|ra|orah?)?$/i)) {
            firstName = "D(\\.|eb(b(y|ie)?|ra|orah?)?)?"+middleName;
        } else if(firstName.match(/^ron(ald|n?(y|ie))?$/i)) {
            firstName = "R(\\.|on(ald|n?(y|ie))?)?"+middleName;
        } else if(firstName.match(/^(miriam|mar(ie|y|iam))$/i)) {
            firstName = "M(\\.|(i|a)riam|y|ie)?"+middleName;
        } else if(firstName.match(/^mi(cha?el|key?)$/i)) {
            firstName = "M(\\.|i(key?|cha?el))?"+middleName;
        } else if(firstName.match(/^mat(t?hew)?$/i)) {
            firstName = "M(\\.|at(t?hew)?)?"+middleName;
        } else if(firstName.match(/^ken(n?(y|ie|eth))?$/i)) {
            firstName = "K(\\.|en(n?(y|ie|eth))?)?"+middleName;
        } else if(firstName.match(/^ric[hk]?(ardo?|ie)?$/i)) {
            firstName = "R(\\.|ic[hk]?(ardo?|ie)?)?"+middleName;
        } else if(firstName.match(/^m(oe?|(u|o)hamm?(a|e|u|i)(d|t))$/i)) {
            firstName = "M(\\.|oe?|(u|o)hamm?(a|u|e|i)(d|t))?"+middleName;
        } else if(firstName.match(/^jo(s?e(y|ph)?)?$/i)) {
            firstName = "J(\\.|o(s?e(y|ph)?)?)?"+middleName;
        } else if(firstName.match(/^sam(uel|m?(ie|y)|antha)?$/i)) {
            // This one might be dangerous as a unisex name. If "Samuel Smith" is intended to be
            //  blocked, this might also block "Samantha Smith". Leaving for now.
            firstName = "S(\\.|am(uel|m?(ie|y)|antha)?)?"+middleName;
        } else if(firstName.match(/^jess((e|i)ca|y|ie)?$/i)) {
            firstName = "J(\\.|ess((e|i)ca|y|ie)?)?"+middleName;
        } else if(firstName.match(/^(an)?th?o(ine|n(ie|y))$/i)) {
            firstName = "(An|T)(\\.|h?o(ine|n(ie|y)))?"+middleName;
        } else if(firstName.match(/^and(y|ie|rew)$/i)) {
            firstName = "A(\\.|nd(y|ie|rew))?"+middleName;
        } else if(firstName.match(/^br(i|e)e?(ann?a)?$/i)) {
            firstName = "B(\\.|r(i|e)e?(ann?a)?)?"+middleName;
        } else {
            // Since it matches no names in our index above, set it with the generic pattern:
            //    ${FIRST_NAME:0:1}(\.|${FIRST_NAME:1:strlen(FIRST_NAME)}) ---> Example: E(\.|ric)?
            firstName = firstName.substring(0,1)+"(\\.|"+firstName.substring(1,firstName.length)+")?";
            // Now combine it with the middle name, if any.
            firstName += middleName;
        }

        // Build a version of the regex that will catch the name in the formal and informal pattern.
        //   So, match both: "John H. Smith" and "Smith, John H." formats.
        let name = "("+firstName+" "+lastName+")|("+lastName+" "+firstName+")";

        /*
         * Scan the string now and condense similar chars into a regex quantity operator.
         * EXAMPLE: The name William. This will hit the 'i' and then look ahead until the last
         *     consecutive 'i' or 'l', once it sees 4 of the chars consecutively, it will drop in
         *     a {3,5} into the string. The NEXT STEP will remove all the extras from the string
         *     and condense them into a single character properly.
         */
        for(let i = 0; i < name.length; i++) {
            if(name[i].match(/[il]/i)) {
                for(let j = 1; ; j++) {
                    if(!name[i+j].match(/[li]/i)) {
                        if(j > 1) {
                            name = name.substring(0,i+1)+"{"+(j-1).toString()+","
                                +(j+1).toString()+"}"+name.substring(i+j,name.length);
                            i = i+j+3;
                            break;
                        } else { break; }
                    }
                }
            } else if (name[i].match(/e/i)) {
                if(name[i+1].match(/e/i)) {
                    name = name.substring(0,i+1)+"{1,3}"+name.substring(i+2,name.length);
                    i += 5;
                } else { continue; }
            } else if (name[i].match(/s/i)) {
                if(name[i+1].match(/s/i)) {
                    name = name.substring(0,i+1)+"{1,3}"+name.substring(i+2,name.length);
                    i += 5;
                } else { continue; }
            } else if (name[i].match(/t/i)) {
                if(name[i+1].match(/t/i)) {
                    name = name.substring(0,i+1)+"{1,3}"+name.substring(i+2,name.length);
                    i += 5;
                } else { continue; }
            } else if (name[i].match(/o/i)) {
                if(name[i+1].match(/o/i)) {
                    name = name.substring(0,i+1)+"{1,3}"+name.substring(i+2,name.length);
                    i += 5;
                } else { continue; }
            } else if (name[i].match(/b/i)) {
                if(name[i+1].match(/b/i)) {
                    name = name.substring(0,i+1)+"{1,3}"+name.substring(i+2,name.length);
                    i += 5;
                } else { continue; }
            }
        }

        // Replace chars vulnerable to typosquatting with their regex equivalent.
        name = name.toString()
            .replace(/[il]+/gi,(this.props.caseInsensitive ? "[il1]" : "[iIlL1]"))
            .replace(/e+/gi,(this.props.caseInsensitive ? "[e3]" : "[Ee3]"))
            .replace(/s+/gi,(this.props.caseInsensitive ? "[s5]" : "[Ss5]"))
            .replace(/t+/gi,(this.props.caseInsensitive ? "[t7]" : "[Tt7]"))
            .replace(/o+/gi,(this.props.caseInsensitive ? "[o0]" : "[Oo0]"))
            .replace(/b+/gi,(this.props.caseInsensitive ? "[b8]" : "[Bb8]"));

        // Replace any remaining spaces with a \s switch.
        name = name.toString().replace(/\s+/gi,"\\s+");

        if(this.props.exempt && !this.props.spamassassin) {
            name = `From:\\s*\"?\\s*"+${name}+"\\s*\"?\\s+<(?!(${this.parseExempts(this.props.exempt)})>\\s*$)`;
        } else if (this.props.exempt && this.props.spamassassin) {

        }

        return name;
    }

    parseExempts(exempts) {
        return exempts.replace(/,+/g,"|").replace(/@/g,"\\@").replace(/\+/g,"\\+")
            .replace(/\./g,"\\.").replace(/\-/g,"\\-");
    }

    render() {
        return (<div>
            {!this.props.spamassassin ? (
                <code>{`${this.parseInput(this.props.text)}`}</code>
            ) : (<div>
                {this.props.exempt ? (
                <code>
                    {`header __BSF_SP_EXEC_FROM From =~ /${this.parseInput(this.props.text)}/i`}<br />
                    {`header __BSF_SP_EXEC_EXEMPT From:addr =~ /(${this.parseExempts(this.props.exempt)})/i`}<br />
                    {`meta BSF_SP_EXEC (__BSF_SP_EXEC_FROM && !__BSF_SP_EXEC_EXEMPT)`}<br />
                    {`describe BSF_SP_EXEC Spoofed Executive`}<br />
                    {`score BSF_SP_EXEC 10.00`}
                </code>
                ) : (
                    <code>{`To generate a SpamAssassin rule, you need to enter one or more exempt email addresses.`}</code>
                )}</div>
            )}
        </div>);
    }
}
