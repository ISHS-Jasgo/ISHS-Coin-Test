export default class Coin {
    private name: string;
    private coins: Array<String> = [
        'BTC',
        'ETH',
        'SHIB',
        'DOGE'
    ]
    private coinKind: string;

    constructor(name: string, coinKind: string) {
        this.name = name;
        this.coinKind = coinKind;
    }

    public getName(): string {
        return this.name;
    }

    public getPrice(): number {
        let value: number = 0;
        fetch('https://api.upbit.com/v1/ticker?markets=KRW-' + this.coinKind)
        .then(response => response.json())
        .then(data => {
            if(this.coinKind == 'BTC') {
                value = Math.floor(data[0].trade_price - 100000000) / 100;
            }
            else if(this.coinKind == 'ETH') {
                value = Math.floor(data[0].trade_price - 1000000) / 1000;
            }
            else if(this.coinKind == 'SHIB') {
                value = Math.floor(data[0].trade_price * 100000);
            }
            else if(this.coinKind == 'DOGE') {
                value = Math.floor(data[0].trade_price * 10);
            }
            console.log(this.coinKind, value);
            console.log('')
            
        });
        return value;
    }
}