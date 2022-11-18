# inizio

<!-- toc -->

- [About The Project](#about-the-project)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

<!-- tocstop -->

## About The Project

> This package recursively copy a folder while replacing variables in files!

This project is meant to be used as a skaffold anything and easily

<!-- GETTING STARTED -->

## Usage

```sh
npx inizio --source my-boilerplate --output my-new-project
# Enjoy
```

## Variables

You can use variables inside your files following this format ``{{ MY_VARIABLE }}`, this is a logic-less replace, this is not a template engine. Only variables found in templates are replaced.

```sh
MY_VAR=123 inizio ...
# All OS level variables are also used
```

## Options

| flag | description |
| --- | --- |
| `--source -s` | The source directory or file |
| `--output -o` | The output destination|
| `--verbose -v` | Add more info to errors |
| `--dryRun -d` | Output operation to console without writing |
| `--ignore -i` | Ignore paths, can be used multiple times, eg: `**/.git/**` |


<!-- CONTRIBUTING -->

## Contributing

Project is pretty simple and straight forward for what is my needs, but if you have any idea you're welcome.

This projects uses [commitlint](https://commitlint.js.org/) with Angular configuration so be sure to use standard commit format or PR won't be accepted.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat(scope): some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Simone Corsi - [@im_simonecorsi](https://twitter.com/im_simonecorsi)
