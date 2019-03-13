import React, { Component } from 'react';
import RegexGenerator from './Components/RegexGenerator';
import './App.css';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            caseInsensitive : false,
            spamassassin : false,
            firstnameExpansion : true,
            input : "",
            givenName : "", givenNameError : "",
            exempts : "", exemptsError : "", exemptsInput : ""
        };

        this.updateRegex = this.updateRegex.bind(this);
        this.updateExempts = this.updateExempts.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
    }

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
            caseInsensitive : false,
            spamassassin : false,
            firstnameExpansion : true,
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
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name] : value });

        if(name === 'spamassassin' && value) {
            this.setState({caseInsensitive : true});
            document.getElementById('caseInsensitive').disabled = true;
        } else if (name === 'spamassassin' && !value) {
            if(this.state.caseInsensitive) { this.setState({caseInsensitive : false}); }
            document.getElementById('caseInsensitive').disabled = false;
        }
    }

    render() {
        return (
            <div className="App">
                <div id="header-container" className="form-container">
                    {/*<img src="resources/toolLogo.svg" id="tool-logo" alt="" /><br />*/}
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
                     for="caseInsensitive">{"Case Insensitive:"}&nbsp;
                    <input type="checkbox" name="caseInsensitive" id="caseInsensitive"
                     checked={this.state.caseInsensitive} onChange={(e)=>{this.handleFormChange(e);}} />
                    <div className="checkboxView"><span>{"X"}</span></div></label>
                    <label style={{float:'right'}} title="Create a SpamAssassin meta-rule that supports exemption by email."
                     for="spamassassin">{"Spam-Assassin:"}&nbsp;
                    <input type="checkbox" name="spamassassin" id="spamassassin"
                     checked={this.state.spamassassin} onChange={(e)=>{this.handleFormChange(e);}} />
                    <div className="checkboxView"><span>{"X"}</span></div></label>
                    <br />
                    <label title="Expand variations of common first names, for example Bob into Robert, Bobbie, etc."
                     for="firstnameExpansion">{"Expand First-Name:"}&nbsp;
                    <input type="checkbox" name="firstnameExpansion" id="firstnameExpansion"
                     checked={this.state.firstnameExpansion} onChange={(e)=>{this.handleFormChange(e);}} />
                    <div className="checkboxView"><span>{"X"}</span></div></label>
                </div>
                <div className="form-container" style={{'text-align':'center'}}>
                    <input type="button" value="Reset" onClick={()=>{this.resetForm()}} />
                </div>
                <div className="form-container" id="results-container">
                    <RegexGenerator text={this.state.givenName} exempt={this.state.exempts}
                     caseInsensitive={this.state.caseInsensitive} spamassassin={this.state.spamassassin}
                     expand={this.state.firstnameExpansion} />
                </div>
                <div className="form-container" style={{'text-align':'center','font-size':'10px','margin-bottom':'10px'}}>
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
                <div className="form-container" style={{'text-align':'center','font-size':'14px'}}>
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
