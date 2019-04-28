# Prevention Filter Web Form
If you want to use this on your own internal/external server, you are free to do so. You'll need to compile this yourself using **NPM/NodeJS**. _Note: I will leave learning how to install/use NPM up to you._

Clone the repository onto your PC with git, navigate to the directory in your terminal and type `npm install`.

Once the packages are finished installing, edit the `package.json` file and replace the `"homepage"` value with your target URL/website and directory, like so:
```
...
"license": "GPL-3.0",
--> (ADD THIS LINE with your server's address instead of the example one) --> "homepage": "https://example.net/subdirectory/",
"description": "A tool to create special rules that will thwart Display-Name spoofing in the From header of an email.",
...
```

Then, run `npm run build` in the `web-form` directory. After that you can copy/paste the contents of the Build folder to your web server's subdirectory.

_NOTE_: This project doesn't use a Router object, so it can be deployed easily by the above method.
