import React, { Component } from 'react';
import RegexGenerator from './Components/RegexGenerator';
import './App.css';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            caseInsensitive : false,
            spamassassin : false,
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
        //if(!input) { return; }
        if(input.match(/^([a-z.\-']+\s+){1,3}[a-z.\-']+\s*$/gi)) {
            this.setState({ givenName : input, givenNameError : "" });
        } else {
            this.setState({
                givenName : "",
                givenNameError : (input ? "The NAME field can only contain up to 4 parts of a name, and no less than two. Permitted special characters are: \', ., and -" : "")
            });
        }

        this.setState({ input : input });
    }

    // Check the input on the email exemptions field before passing it to the RegexGenerator object.
    updateExempts(event) {
        let input = event.target.value;
        //if(!input) { return; }
        if(input.match(/^[a-zA-Z0-9+\-_.=%]+@[a-zA-Z0-9.\-]+\.[a-zA-Z0-9]{2,}(,[a-zA-Z0-9+\-_.=%]+@[a-zA-Z0-9.\-]+\.[a-zA-Z0-9]{2,})*$/gi)) {
            this.setState({ exempts : input, exemptsError : "" });
        } else {
            this.setState({ exemptsError : (input ? "You must separate your email address exemptions by a single comma each (no spaces)." : "")});
        }

        this.setState({ exemptsInput : input });
    }

    // Set all states back to the initial state in the Class constructor function.
    resetForm() {
        this.setState({
            caseInsensitive : false,
            spamassassin : false,
            input : "",
            givenName : "", givenNameError : "",
            exempts : "", exemptsError : "", exemptsInput : ""
        });
        document.getElementById('case-checkbox').disabled = false;
    }

    handleFormChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name] : value });

        if(name === 'spamassassin' && value) {
            this.setState({caseInsensitive : true});
            document.getElementById('case-checkbox').disabled = true;
        } else if (name === 'spamassassin' && !value) {
            if(this.state.caseInsensitive) { this.setState({caseInsensitive : false}); }
            document.getElementById('case-checkbox').disabled = false;
        }
    }

    render() {
        return (
            <div className="App">
                <div id="header-container" className="form-container">
                    <img src="/resources/BarracudaLogo.svg" id="cuda-logo"  /><br />
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
                    <label>Case Insensitive:&nbsp;
                        <input type="checkbox" name="caseInsensitive" id="case-checkbox"
                         checked={this.state.caseInsensitive} onChange={(e)=>{this.handleFormChange(e);}} />
                    </label>
                    <label style={{float:'right'}}>Spam-Assassin:&nbsp;
                        <input type="checkbox" name="spamassassin"
                        checked={this.state.spamassassin} onChange={(e)=>{this.handleFormChange(e);}} />
                    </label>
                </div>
                <div className="form-container" style={{'text-align':'center'}}>
                    <input type="button" value="Reset" onClick={()=>{this.resetForm()}} />
                </div>
                <div className="form-container" id="results-container">
                    <RegexGenerator text={this.state.givenName} exempt={this.state.exempts}
                     caseInsensitive={this.state.caseInsensitive} spamassassin={this.state.spamassassin} />
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
                            {"emails, like the Barracuda ESG, and acts as a "}<strong>{"substitute"}</strong>
                            {" for systems that do not support look-aheads for exemptions."}
                        </p>
                        <p>
                            {"To apply them, either navigate to the "}<i>{"local.cf"}</i>{" file on the target MTA using "}
                            {"the spamd service, or (if you're using a Barracuda ESG) contact Barracuda Support and tell them to reference "}
                            <strong>{"Solution #00005971, STEP 8"}</strong>{" for adding the custom rule to your appliance."}
                        </p>
                    </div>
                </div>
                <div id="help-button" onClick={()=>{document.getElementById('help-popup').style.display = 'block';}}>{"?"}</div>
            </div>
        );
    }
}
