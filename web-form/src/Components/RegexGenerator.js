import React, { Component } from 'react';
import { wellKnownNames } from './FirstNames';

export default class RegexGenerator extends Component {
    constructor(props) {
        super(props);
        this.parseInput = this.parseInput.bind(this);
        this.parseExempts = this.parseExempts.bind(this);
        this.implementSquatProtection = this.implementSquatProtection.bind(this);
    }
    
    static defaultProps = {
    	titlePrefixes : ["Mr", "Ms", "Mrs", "Doctor", "Professor"],
    	titleSuffixes : ["CxO", "VP", "Sr", "Jr", "M.D.", "Ph.D", "Director"]
    }

    // Parse the "name" field and ensure that a valid name is entered.
    //  After that, return the appropriate expression to pipe into the form output.
    parseInput(input) {
        if(!input) { return ""; }
        else { input = input.toString().replace(/[.']/gi, ""); }

        // Capture certain pieces of the name
        let firstName  = input.match(/^\s*[a-z'\-.]+\s+/i).toString().trim();
        let lastName   = input.match(/\s+[a-z'\-.]+\s*$/i).toString().trim();
        let middleName = input.toString().replace(/^\s*[a-z'\-.]+\s+|\s+[a-z'\-.]+\s*$/gi, "").trim();
        if(middleName === lastName) { middleName = ""; }

        // If a middle-name is defined, chop it up and make it optional.
        if(middleName) {
            if(middleName.substring(1,middleName.length)) {
                middleName = "( "+middleName.substring(0,1)+"(\\.|"+middleName.substring(1,middleName.length)+")?)?"
            } else { middleName = "( "+middleName.substring(0,1)+"\\.?)?"; }
        }

		// If expanding the first name is desired, do so accordingly.
        if(this.props.expand) {
            // Iterate through well-known first-names with various permutations.
            let isMatch = false
            for(let item in wellKnownNames) {
            	if(firstName.match(wellKnownNames[item].regex) && isMatch !== true) {
            		firstName = wellKnownNames[item].mutation + middleName;
            		isMatch = true
            	}
            }
            if(isMatch !== true) {
            	// Mutate the uncommon name: Sherry --> S(\.|herry)?
            	firstName = firstName.substring(0,1)+"(\\.|"+firstName.substring(1,firstName.length)+")?";
                firstName += middleName;
            }
        } else {
            // Since it matches no names in our index above, set it with the generic pattern:
            //    ${FIRST_NAME:0:1}(\.|${FIRST_NAME:1:strlen(FIRST_NAME)}) ---> Example: E(\.|ric)?
            firstName = firstName.substring(0,1)+"(\\.|"+firstName.substring(1,firstName.length)+")?";
            // Now combine it with the middle name, if any.
            firstName += middleName;
        }
        
        if(this.props.sliceLastName && lastName) {
        	lastName = lastName.substring(0,1)+"(\\.|"+lastName.substring(1,lastName.length)+")?";
        }

		let lastNameSuffix = ""
		// Parse the titles object (if any were selected).
		if(this.props.titles && this.props.titles.length > 0) {
			let titles = this.props.titles
			let tPrefixes = []
			let tPrefix = ""
			let tSuffixes = []
			let tSuffix = ""
			for(let j = 0; j < titles.length; j++) {
				// Split the chosen title into the "prefix" or "suffix" type.
				if(this.props.titlePrefixes.includes(titles[j])) {
					tPrefixes.push(titles[j])
				} else if(this.props.titleSuffixes.includes(titles[j])) {
					tSuffixes.push(titles[j])
				}
			}
			if(tPrefixes && tPrefixes.length > 0) {
				tPrefix += "(("
				for(let i = 0; i < tPrefixes.length; i++) {
					if(tPrefixes[i] === 'Doctor') {
						tPrefix += '(dr\\.?|doctor)'
					} else if(tPrefixes[i] === 'Professor') {
						tPrefix += '(prof(\\.|essor)?)'
					} else if(tPrefixes[i] === 'Director') {
						tPrefix += '(dir(ector)?)'
					} else {
						tPrefix += `(${tPrefixes[i]}\\.?)`
					}
					// If there are still more to parse, add a pipe.
					if(i < tPrefixes.length - 1) { tPrefix += "|" }
				}
				// Close the nest and require at least one space between the prefix and first name.
				tPrefix += ") )?"
				// Append the prefix string to the first name item.
				firstName = `${tPrefix}${firstName}`
			}
			if(tSuffixes && tSuffixes.length > 0) {
				tSuffix += "(,? ("
				for(let i = 0; i < tSuffixes.length; i++) {
					if(tSuffixes[i] === 'M.D.') {
						tSuffix += '(M\\.?D\\.?|D(r\\.?|octor) of Medicine)'
					} else if(tSuffixes[i] === 'Ph.D') {
						tSuffix += '(Ph\\.?D)'
					} else if(tSuffixes[i] === 'VP') {
						tSuffix += '(V\\.?P\\.?|Vice President)'
					} else if(tSuffixes[i] === 'CxO') {
						tSuffix +='(C\\.?\\w\\.?O\\.?|Chief( of)? \\w+( Officer)?)'
					} else {
						tSuffix += `(${tSuffixes[i]}\\.?)`
					}
				}
				// Close out the nesting.
				tSuffix += "))?"
				// This variable is different from the way prefixes work, as they're almost exclusively at the
				//  end of a person's name whether or not their name is reversed.
				lastNameSuffix = tSuffix
			}
		}

        // Build a version of the regex that will catch the name in the formal and informal pattern.
        //   So, match both: "John H. Smith" and "Smith, John H." formats.
        let name = "("+firstName+" "+lastName+lastNameSuffix+")|("+lastName+",? "+firstName+lastNameSuffix+")";

        /*
         * Scan the string now and condense similar chars into a regex quantity operator.
         * EXAMPLE: The name William. This will hit the 'i' and then look ahead until the last
         *     consecutive 'i' or 'l', once it sees 4 of the chars consecutively, it will drop in
         *     a {3,5} into the string. The NEXT STEP will remove all the extras from the string
         *     and condense them into a single character properly.
         */
        if(this.props.typosquatProtection) {
        	// Just leave this on with TS protection. Was set to 2 but makes too many [il1] combos.
        	if(Number(this.props.TSLVL) >= 1) {
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
		    }

	        // Replace chars vulnerable to typosquatting with their regex equivalent, depending on the strength of TSLVL.
	        ["il", "o", "e", "s", "t", "b"].map((item, index) => {
	        	let regexStr = `[${item}]`
	        	if(Number(this.props.TSLVL > 1)) { regexStr += "+" }
	        	let regex = new RegExp(regexStr, "gi")
	        	let strength = this.props.TSLVL ? this.props.TSLVL : 0
	        	let replaceStr = this.implementSquatProtection(item, strength, this.props.caseInsensitive)
	        	name = name.toString().replace(regex, replaceStr)
	        	return null
	        })
        }

        // Replace any remaining spaces with a \s expression.
        name = name.toString().replace(/\s+/gi,"\\s+");

        if(this.props.exempt && !this.props.spamassassin) {
            name = `From:\\s*"?\\s*(${name})\\s*"?\\s+<(?!(${this.parseExempts(this.props.exempt)})>\\s*$)`;
        } else if(!this.props.exempt && !this.props.spamassassin) {
            name = `From:\\s*"?\\s*(${name})\\s*"?\\s+<`;
        }

        return name;
    }
    
    
    // Get the substring used to replace typosquat characters in the Name field, depending on the prot lvl.
    implementSquatProtection(chars, tsLvl, caseInsensitive) {
    	let equivalencies = {
    		"il" : { num : "1", tsLvl: 1 },
    		"o" : { num : "0", tsLvl: 2 },
    		"e" : { num : "3", tsLvl: 3 },
    		"s" : { num : "5", tsLvl: 4 },
    		"t" : { num : "7", tsLvl: 5 },
    		"b" : { num : "8", tsLvl: 5 },
    	}
    	
    	// If the ts prot lvl is lower than the requirement for the passed character, just return the char (if not "il").
    	if(tsLvl < equivalencies[chars].tsLvl && chars !== 'il') { return chars }
    	
    	let finalReplacement = "[" + chars
    	if(caseInsensitive === false) { finalReplacement += chars.toUpperCase() }
    	if(equivalencies[chars] && tsLvl >= equivalencies[chars].tsLvl) { finalReplacement += equivalencies[chars].num }
    	finalReplacement += "]"
    	
    	return finalReplacement
    }
    

    // Replace exempts field with appropriate backslashes and other substitutions.
    parseExempts(exempts) {
        return exempts.replace(/,+/g,"|").replace(/@/g,"\\@").replace(/\+/g,"\\+")
            .replace(/\./g,"\\.").replace(/-/g,"\\-");
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
                    {`describe BSF_SP_EXEC Spoofed Display Name`}<br />
                    {`score BSF_SP_EXEC 10.00`}
                </code>
                ) : (
                    <code>{`To generate a SpamAssassin rule, you need to enter one or more exempt email addresses.`}</code>
                )}</div>
            )}
        </div>);
    }
}
