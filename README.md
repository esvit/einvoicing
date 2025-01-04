# European Invoicing (eInvoicing)

## About

eInvoicing is a JavaScript library designed to create and parse electronic invoices in compliance with the [eInvoicing Directive and European standard](https://ec.europa.eu/digital-building-blocks/wikis/display/DIGITAL/eInvoicing).

The library ensures full adherence to [EN 16931](https://ec.europa.eu/digital-building-blocks/sites/display/DIGITAL/EN+16931+compliance), supporting the most widely used CIUS (Core Invoice Usage Specifications) and extensions, including [PEPPOL BIS](https://docs.peppol.eu/poacc/billing/3.0/bis/), enabling seamless integration with eInvoicing systems across Europe.

## Installation

First of all, make sure your environment meets the following requirements:

Then, you should be able to install this library using Composer:

```
npm i --save einvoicing
```

## Usage

### Importing invoice documents

```typescript
import { UblReader } from 'einvoicing';

const ublReader = new UblReader();
const document = await ublReader.readFromFile('invoice.xml');
```

## Who uses it?

<table>
<tr>
<td align="center"><a href="https://itfin.us/"><img src="/.github/images/itfin_logo.svg" width="64" /></a></td>
</tr>
<tr>
<td align="center"><a href="https://itfin.us/">ITFin</a></td>
</tr>
</table>

\_👋 You use einvoicing and you want to be listed there? [Contact me](mailto:esvit666@gmail.com).

## Contributing

Contributions are more than welcome, the code base is still new and needs more love.

For more information, please checkout the [contributing document](https://github.com/esvit/einvoicing/blob/main/CONTRIBUTING.md).

## Contributors

<!-- readme: contributors -start -->
<table>
	<tbody>
		<tr>
            <td align="center">
                <a href="https://github.com/esvit">
                    <img src="https://avatars.githubusercontent.com/u/1222467?v=4" width="100;" alt="esvit"/>
                    <br />
                    <sub><b>Vitalii Savchuk</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/albertfdp">
                    <img src="https://avatars.githubusercontent.com/u/649667?v=4" width="100;" alt="albertfdp"/>
                    <br />
                    <sub><b>Albert Fernández</b></sub>
                </a>
            </td>
		</tr>
	<tbody>
</table>
<!-- readme: contributors -end -->
