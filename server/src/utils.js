
inquirer.registerPrompt('directory', require('inquirer-select-directory'));
inquirer.prompt([{
  type: 'directory',
  name: 'from',
  message: 'Where you like to put this component?',
  basePath: './'
}]).then(function(answers) {
  //etc
});