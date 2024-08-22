async function readABIFromURL(url) {
    try {
        const response = await fetch(url);
        const contractData = await response.json();
        return contractData.abi;
    } catch (error) {
        console.error('Error fetching file:', error);
        return null;
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    if (typeof window.ethereum !== 'undefined') {
        // try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            window.account = accounts[0];
            console.log('Connected account:', window.account);
            window.web3 = new Web3(window.ethereum);
            const ABI = await readABIFromURL("/contracts/TheoDoi.json");
            console.log('ABI:', ABI);
            const ABISignature = ABI.map(method => {
                const inputs = method.inputs.map(input => input.type);
                const callName = method.name + '(' + inputs.join(',') + ')';
                return {
                    name: method.name,
                    signature: window.web3.eth.abi.encodeFunctionSignature(callName),
                    inputs: method.inputs.map(input => input.type)
                };
            });
            console.log('ABISignature:', ABISignature);
            const latestBlock = Number(await window.web3.eth.getBlockNumber());
            console.log('Latest block:', latestBlock);
            let counter = latestBlock;
            for (let i = latestBlock; i >= Math.max(0, latestBlock - 1000); i--) {
                const block = await window.web3.eth.getBlock(i, true);
                if (block === null) {
                    console.error('Error fetching block:', i);
                    counter--;
                    continue;
                }
                console.log(`Fetching block ${i}...`, block);
                if (block.transactions === null) {
                    console.error('Error fetching transactions:', block);
                    counter--;
                    continue;
                }
                block.transactions.forEach(tx => {
                    const methodName = tx.input.slice(0, 10);
                    const methodData = tx.input.slice(10);
                    console.log('Method name:', methodName);
                    // console.log('Method data:', methodData);
                    const method = ABISignature.find(method => method.signature === methodName);    
                    let decodedData = window.web3.eth.abi.decodeParameters(['string', 'string'], methodData) || ['Decoding error', ''];
                    const card = document.createElement('div');
                    card.classList.add('col');
                    card.innerHTML = `
                        <div class="card">
                            <div class="card-header">
                                <b>Transaction ${counter}</b> ${tx.hash}
                            </div>
                            <div class="card-body">
                                <p class="card-text"><b>From:</b> ${tx.from}</p>
                                <p class="card-text"><b>To:</b> ${tx.to}</p>
                                <p class="card-text"><b>Method:</b> ${JSON.stringify(method)}</p>
                                <p class="card-text"><b>Data:</b></p>
                                <ul><li> ${Object.values(decodedData).slice(0, -1).join('<li>')}</li></ul>
                            </div>
                        </div>
                    `;
                    document.getElementById('transactionsContainer').appendChild(card);
                    counter--;
                });
            }
        // } catch (error) {
        //     console.error("Error fetching transactions:", error);
        // }
    } else {
        console.log('Please install MetaMask!');
    }
});