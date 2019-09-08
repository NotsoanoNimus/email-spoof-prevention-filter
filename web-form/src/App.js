import React, { Component } from 'react';
import RegexGenerator from './Components/RegexGenerator';
import './App.css';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            caseInsensitive : true,
            spamassassin : false,
            typosquatProtection : true,
            firstnameExpansion : true,
            TSLVL : 1,
            sliceLastName : false,
            includeTitles : false,
            titles : [],
            input : "",
            givenName : "", givenNameError : "",
            exempts : "", exemptsError : "", exemptsInput : ""
        };

        this.updateRegex = this.updateRegex.bind(this);
        this.updateExempts = this.updateExempts.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
    }

    static defaultProps = {
    	titleOptions : ["Mr", "Ms", "Mrs", "Doctor", "Sr", "Jr", "Professor", "Director", "CxO", "VP", "M.D.", "Ph.D"]
    };

    // Check the input on the name input field before passing it to the RegexGenerator object.
    updateRegex(event) {
        let input = event.target.value;
        // Match against any word composed of /[a-z]/i, -, ., or ', up to 4 "words"
        if(input.match(/^([a-z.\-']+\s+){1,3}[a-z.\-']+\s*$/gi)) {
            this.setState({ givenName : input, givenNameError : "" });
        } else {
            this.setState({
                givenName : "",
                givenNameError : (input ? "The NAME field can only contain up to 4 parts of a name, and no less than two. Permitted special characters are: ' . -" : "")
            });
        }

        this.setState({ input : input });
    }

    // Check the input on the email exemptions field before passing it to the RegexGenerator object.
    updateExempts(event) {
        let input = event.target.value;
        // Match against any email address, or MULTIPLE addresses, each separated by a single comma.
        // eslint-disable-next-line
        if(input.match(/^[a-zA-Z0-9+\-_.=%]+@[a-zA-Z0-9.\-]+\.[a-zA-Z0-9]{2,}(,[a-zA-Z0-9+\-_.=%]+@[a-zA-Z0-9.\-]+\.[a-zA-Z0-9]{2,})*$/gi)) {
            this.setState({ exempts : input, exemptsError : "" });
        } else {
            this.setState({ exemptsError : (input ? "You must separate your email address exemptions by a single comma each (no spaces), and ensure that each email is within a standard email address format." : ""),
                exempts : "" });
                // ^ This MUST be added so an invalid exemption AFTER entering a VALID email would remove it from the generated expression.
        }

        this.setState({ exemptsInput : input });
    }

    // Set all states back to the initial state in the App constructor function.
    //   Also, ensure the form does not keep certain elements disabled.
    resetForm() {
        this.setState({
            caseInsensitive : true,
            spamassassin : false,
            typosquatProtection : true,
            firstnameExpansion : true,
            TSLVL : 1,
            sliceLastName : false,
            includeTitles : false,
            titles: [],
            input : "",
            givenName : "", givenNameError : "",
            exempts : "", exemptsError : "", exemptsInput : ""
        });
        document.getElementById('caseInsensitive').disabled = false;
    }

    // Any time the form is changed in the render() function, update the state
    //   of the page here. This is primarily used by the checkboxes at this time.
    handleFormChange(event) {
        const target = event.target;
        const name = target.name;
        let value = target.type === 'checkbox' ? target.checked : target.value;

        let selectedOptions = [];
        if(name === 'titles') {
        	let options = target.options;
        	for(let i = 0; i < options.length; i++) {
        		let opt = options[i];
        		if(opt && opt.selected) {
        			selectedOptions.push(opt.value);
        		}
        	}
        	value = selectedOptions;
        } else if(name === 'TSLVL') {
        	value++;
    	} else if(name === 'includeTitles' && value === false) {
    		this.setState({titles : []})
    	} else if(name === 'typosquatProtection' && value === false) {
            this.setState({TSLVL : 1})
        }

        this.setState({ [name] : value });

        if(name === 'spamassassin' && value) {
            this.setState({caseInsensitive : true});
            document.getElementById('caseInsensitive').disabled = true;
        } else if (name === 'spamassassin' && !value) {
            //if(this.state.caseInsensitive) { this.setState({caseInsensitive : false}); }
            document.getElementById('caseInsensitive').disabled = false;
        }
    }

    render() {
        return (
            <div className="App">
                <div id="header-container" className="form-container">
                    <div id="header-text">{`Spoof Prevention Assistant`}</div>
                </div>
                <div id="textbox-container" className="form-container">
                    <input type="text" value={this.state.input} placeholder="Target Name..."
                     onChange={(e)=>{this.updateRegex(e);}} className="form-entry-text" />
                    <br />
                    <input type="text" value={this.state.exemptsInput} placeholder="Exempt Email Addresses..."
                     onChange={(e)=>{this.updateExempts(e);}} className="form-entry-text" />
                </div>
                <div id="checkbox-container" className="form-container">
                    <label title="Get rid of mixed-case characters between the square bracket selectors ([])."
                     htmlFor="caseInsensitive">{"Case Insensitive:"}&nbsp;
                    <input type="checkbox" name="caseInsensitive" id="caseInsensitive"
                     checked={this.state.caseInsensitive} onChange={(e)=>{this.handleFormChange(e);}} />
                    <div className="checkboxView"><span>{"X"}</span></div></label>
                    <label style={{float:'right'}} title="Create a SpamAssassin meta-rule that supports exemption by email."
                     htmlFor="spamassassin">{"Spam-Assassin:"}&nbsp;
                    <input type="checkbox" name="spamassassin" id="spamassassin"
                     checked={this.state.spamassassin} onChange={(e)=>{this.handleFormChange(e);}} />
                    <div className="checkboxView"><span>{"X"}</span></div></label>
                    <br />
                    <label title="Protect against typosquatting (e.g. maliciously replacing 'I' with 'L')."
                     htmlFor="typosquatProtection">{"Typosquat Protection:"}&nbsp;
                    <input type="checkbox" name="typosquatProtection" id="typosquatProtection"
                     checked={this.state.typosquatProtection} onChange={(e)=>{this.handleFormChange(e);}} />
                    <div className="checkboxView"><span>{"X"}</span></div></label>
                    <label style={{float:'right'}} title="Expand variations of common first names, for example Bob into Robert, Bobbie, etc."
                     htmlFor="firstnameExpansion">{"Expand First-Name:"}&nbsp;
                    <input type="checkbox" name="firstnameExpansion" id="firstnameExpansion"
                     checked={this.state.firstnameExpansion} onChange={(e)=>{this.handleFormChange(e);}} />
                    <div className="checkboxView"><span>{"X"}</span></div></label>
                    {this.state.typosquatProtection ? (<div>&#187;
                    	<select style={{display:'inline-block',margin:'10px 5px 10px 8px'}} size="1" name="TSLVL"
                    	 id="TSLVL" onChange={(e)=>{this.handleFormChange(e);}}>
                    	{["1","2","3","4","5"].map((item,index) => {
                    		return <option key={item} value={index}>{item}</option>
                    	})}
                    	</select>
                    	<span style={{fontSize:'0.7em'}}>
                    		{"Select the level of typosquatting protection you would like. The higher the value, the stronger the filter."}
                    	</span>
                    	<br />
                    </div>) : <br />}
                    <label title="Include a selected list of common name prefixes and suffixes (e.g. 'Mr', 'CEO', etc)."
                     htmlFor="includeTitles">{"Include Titles:"}&nbsp;
                    <input type="checkbox" name="includeTitles" id="includeTitles"
                     checked={this.state.includeTitles} onChange={(e)=>{this.handleFormChange(e);}} />
                    <div className="checkboxView"><span>{"X"}</span></div></label>
                    <label style={{float:'right'}} title="Chop the last name up into the S(\\.?|mith)? format. RISKY; can cause a lot of false-positive results!"
                     htmlFor="sliceLastName">{"Slice Last Name:"}&nbsp;
                    <input type="checkbox" name="sliceLastName" id="sliceLastName"
                     checked={this.state.sliceLastName} onChange={(e)=>{this.handleFormChange(e);}} />
                    <div className="checkboxView"><span>{"X"}</span></div></label>
                    {this.state.includeTitles ? (
                    	<div style={{display:'block',margin:'10px 0'}}>
	                    	<div style={{width:'200px'}}>
	                    		<select style={{float:'left',marginRight:'5px'}} multiple="multiple" size="5"
	                    		 name="titles" id="titles" onChange={(e)=>{this.handleFormChange(e);}}>
	                    		 {this.props.titleOptions.map((title, index) => {
	                    		 	return <option key={title} value={title}>{title}</option>
	                    		 })}
	                    		</select>
	                    		<span style={{fontSize:'0.7em'}}>
	                    			{"Hold down the CTRL (Windows) or Command (Mac) key to select multiple options."}
	     		       			</span>
	                    	</div>
	                    	<br />
                    	</div>
                    ) : null}
                    <div className="form-container" style={{'textAlign':'center'}}>
                    	<input type="button" value="Reset" onClick={()=>{this.resetForm()}} />
                	</div>
                	{this.state.sliceLastName ? (
	                	<div style={{textAlign:'center',marginTop:'10px'}}>
	                		<span style={{fontSize:'0.7em'}}>
	                			<span style={{color:'#FFAAAA'}}>
	                				<strong>{"WARNING"}</strong>
	                				{": Using the 'slice last name' option can cause a high rate of false-positives!"}
	                			</span><br />
	                			<span>
	                				{"There is a possibility of matching the regex to a From header which is only the two initials of the name (e.g. 'From: J S <')."}
	                				<br />{" Or worse yet, it could match something like 'From: John S <' which is highly undesirable."}
	                			</span>
	                		</span>
	                		<br />
	                	</div>
               		) : null}
                </div>
                <div className="form-container" id="results-container">
                    <RegexGenerator text={this.state.givenName} exempt={this.state.exempts}
                     caseInsensitive={this.state.caseInsensitive} spamassassin={this.state.spamassassin}
                     expand={this.state.firstnameExpansion} titles={this.state.titles}
                     typosquatProtection={this.state.typosquatProtection} sliceLastName={this.state.sliceLastName}
                     TSLVL={this.state.TSLVL} />
                </div>
                <div className="form-container" style={{'textAlign':'center','fontSize':'10px','marginBottom':'10px'}}>
                    {"Regex too long? Use the checkbox options to constrain it. Hover over each for more info."}
                </div>
                <div className="error-section form-container">
                    <i>{`Input Errors (if any)`}</i>{` : `}
                    <span style={{'color':'#DD0000'}}>{`${this.state.givenNameError}`}</span>
                </div>
                <div className="error-section form-container">
                    <i>{`Exemption Errors (if any)`}</i>{` : `}
                    <span style={{'color':'#DD0000'}}>{`${this.state.exemptsError}`}</span>
                </div>
                <div className="form-container" style={{'textAlign':'center','fontSize':'14px'}}>
                    {"Test out your regexes "}
                    <a href="https://www.regexr.com/" rel="noopener noreferrer" target="_blank">{"here"}</a>{"."}
                </div>
                <div id="help-popup" onClick={()=>{document.getElementById('help-popup').style.display = 'none';}}>
        			<div id="help-button" onClick={()=>{document.getElementById('help-popup').style.display = 'none';}}>{"X"}</div>
					<div id="help-popup-container" className="form-container">
			            <div id="help-popup-container-text">
			                <h2>{"Applying Content Filters"}</h2>
			                <hr />
			                <p>
			                    {"Content filters generated by this tool can be applied to any email security product "}
			                    {"that uses regex-based content filtering. For example, to apply the generated expression "}
			                    {"to a Barracuda Email Security Gateway, you would go to the "}<strong>{"Block/Accept > "}
			                    {"Content Filtering"}</strong>{" page and add the generated expression as an "}<i>{"Inbound "}
			                    {"Block"}</i>{" for "}<i>{"Headers"}</i>{"."}
			                </p>
			                <p>
			                    {"NOTE: Non-Spam-Assassin content filters with Exempt Email Addresses included "}<strong>{"CANNOT"}
			                    </strong>{" be used with a Barracuda ESG/ESS or other content filtering that doesn't support regex "}
			                    {"look-ahead operators (such as: (?!) and (?=))."}
			                </p>
			                <h2>{"SpamAssassin Rules"}</h2>
			                <hr />
			                <p>
			                    {"The SpamAssassin option is used on systems that use the spamd service to filter and score "}
			                    {"emails, and acts as a "}<strong>{"substitute"}</strong>{" for systems that do not support look-aheads for exemptions."}
			                </p>
			                <p>
			                    {"To apply them, either navigate to the "}<i>{"local.cf"}</i>{" file on the target MTA using "}
			                    {"the spamd service, or (if you're using a Barracuda ESG) contact Barracuda Support and tell them to reference "}
			                    <strong>{"Solution #00005971, STEP 8"}</strong>{" for adding the custom rule to your appliance."}
			                </p>
			            </div>
			        </div>
			    </div>
                <div id="help-button" onClick={()=>{document.getElementById('help-popup').style.display = 'block';}}>{"?"}</div>
                <br />
                <div id="footer-text" className="form-container">
                    <strong>{"PLEASE NOTE"}</strong>{": This tool is NOT affiliated with any particular organization, "}
                    {"and is built as an entirely open-source utility. "}
                    {"Regardless of how you apply these rules, I am not responsible (nor is your Email Security provider) "}
                    {"for ANYTHING you break by electing to use this tool. "}<strong>{"BY USING THIS TOOL, YOU AGREE TO ACCEPT "}
                    {"ANY POTENTIAL RISKS THAT MAY BE ASSOCIATED BY ITS USE."}</strong>
                </div>
            </div>
        );
    }
}
