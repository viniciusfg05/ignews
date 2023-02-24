module.exports = {
  testPathIgnorePatterns: ['/node_modules', '/.next', '/.history'],
  //pasta que eu quero ignorar nos test
  setupFilesAfterEnv: [
    //array de arquivos que o jest execute antes de executar os tests
    '<rootDir>/src/tests/setupTests.ts'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest'
    // <rootDir> simboliza a pasta root do projeto // todo arquivo que começa com qualquer caractere tendo um ou mais caracteres e que tenha . e as extensões...
  },
  testEnvironment: 'jsdom', // indica em que ambiente os test estao executando, para saber como jest vai se comportar na hora o html, o que ele precisa pra simular nossa aplicação e testar os componentes
  //jsdom: quando a gente ta rederizando o html. Basicamente ele vai criar uma representação da DOM em JS
  moduleNameMapper: {
    '\\.(scss|css|sass)': 'identity-obj-proxy'
  }
}
