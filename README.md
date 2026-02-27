# Akxesa Manager App

React + TypeScript application to **create Akxesa Subscription
Managers**.

Built with:

-   React 18
-   Vite 7
-   TypeScript 5
-   Wagmi (wallet integration)
-   Viem (Ethereum client)
-   TanStack Query

The application allows you to connect your **EVM-compatible
wallet**, configure parameters, and deploy a Subscription Manager smart contract on the Paseo Asset Hub testnet. 
After deployment, the app **returns the contract address**, which can be
copied or used for further interactions.



##  Requirements

-   Node.js v22.12+
-   pnpm v8+
-   Browser with an EVM-compatible wallet (MetaMask, Talisman,
    Rabby, etc.)



## Installation

1.  Clone the repository:

``` bash
git clone https://github.com/ultracoconut/akxesa-manager.git
```

2.  Enter the project folder:

``` bash
cd akxesa-manager
```

3.  Install dependencies:

``` bash
pnpm install
```

## Development

Run the app in development mode:

``` bash
pnpm dev
```

This starts Vite at:

http://localhost:5173



##  Production Build

Generate the production build:

``` bash
pnpm build
```

This runs TypeScript project build (`tsc -b`) and then creates the
optimized Vite build.

To preview the production build locally:

``` bash
pnpm preview
```

##  How to Use

1.  Click **Connect Wallet** to connect your EVM-compatible wallet.
2.  Fill in the subscription parameters:
    -   Issuer
    -   Subscription duration
    -   Maximum secondary accounts
    -   Maximum allowed modifications for secondary accounts
3.  Click **Create Subscription Manager**.
4.  Once deployed, the contract address will be displayed on screen.


## License

This project is licensed under the Apache License 2.0.

You may obtain a copy of the License at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.


## Author
Jordan (@ultracoconut)   

## Contact
If you have any questions or feedback, feel free to reach out to me at:

Twitter: @ultracoconut