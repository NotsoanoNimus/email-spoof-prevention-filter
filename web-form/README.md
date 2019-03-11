# Prevention Filter Web Form
To deploy the web-based version of the `ceo-filter-gen.sh` script, rewritten in JavaScript, simply copy/paste the **contents of the "build" folder** to the root of your website.

This web form is written in ReactJS so the page is very _reactive_ to the user input, _as keys are entered_.

### Deploying to a Subdirectory
If you want to deploy the form in a subdirectory of your website, you'll need to compile this yourself using **NPM/NodeJS**.

Clone the repository onto your PC with git, navigate to the directory in your terminal, **delete the current build directory**, and type `npm install`.

Once the packages are finished installing, edit the `package.json` file and replace the `"homepage"` value with your target URL/website and directory, like so:
```
...
"license": "GPL-3.0",
--> (ADD THIS LINE with your server's address) --> "homepage": "https://yeethop.xyz/spoofing/",
"description": "A tool to create special rules that will thwart Display-Name spoofing in the From header of an email.",
...
```

Then, run `npm run build` in the `web-form` directory. After that you can copy/paste the contents of the Build folder to your web server's subdirectory.

_NOTE_: This project doesn't use a Router object, so it can be deployed easily by the above method.
