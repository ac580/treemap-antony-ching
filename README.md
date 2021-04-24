# treemap-antony-ching

## Project setup
```
1.make sure you have installed npm and vue cli (npm install -g @vue/cli) first (mine is up to date for both).
2.npm install
3.npm run serve
4.if npm install fail, please removed the node_modules folder and run npm intsall again
5.if it works, should be rendered on http://localhost:8080/#/editor
```

### Compiles and minifies for production
```
1.npm run build
2.if fail, please try npm run build again
3.after build success it should generate a dist(rename-able) folder, you can ftp the folder to your domain and it should started like this: [yourdomain]/dist/index.html#/editor 

```

### Edit css
Install ruby installer,
Open Ruby command line
For the first ever time, run > gem install sass
run > sass --watch scss/style.scss:css/style.css
