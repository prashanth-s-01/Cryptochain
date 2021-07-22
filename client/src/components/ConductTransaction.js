import React, {Component} from 'react';
import { FormGroup, FormControl, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';
import './component.css'

class ConductTransaction extends Component{
    state={recipient: '', amount: 0, knownAddresses: []};

    componentDidMount(){
        fetch(`${document.location.origin}/api/known-addresses`)
        .then(response=>response.json())
        .then(json=>this.setState({knownAddresses: json}));
    }

    updateRecipient=event=>{
        this.setState({recipient: event.target.value});
    }

    updateAmount=event=>{
        this.setState({amount: Number(event.target.value)});
    }

    conductTransaction=()=>{
        const {recipient, amount}=this.state;
        if(recipient.length!==0 && amount>0)
        {
            fetch(`${document.location.origin}/api/transact`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({recipient, amount})
            })
            .then(response=>response.json())
            .then(json=>{
                alert(json.message || json.type);
                history.push('/transaction-pool');
            });
        }
        else{
            alert('Invalid input. Try Again');
        }
    }

    render(){
        return (
            <div className="ConductTransaction">
                <Link to="/">Home</Link>
                <h2>Conduct a Transaction</h2> 
                <h3>--Known Addresses--</h3>
                <div>
                {
                    this.state.knownAddresses.map(knownAddress=>{
                        return (
                            <div key={knownAddress}>
                                <div className="KnownAddresses">{knownAddress}</div>
                            </div>
                        );
                    })
                }
                </div>
                <br />
                <FormGroup>
                    <FormControl input="text" placeholder="recipient" value={this.state.recipient} onChange={this.updateRecipient} />
                </FormGroup>
                <FormGroup>
                    <FormControl input="number" placeholder="amount" value={this.state.amount} onChange={this.updateAmount} />
                </FormGroup>
                <div>
                    <Button bsstyle="danger" onClick={this.conductTransaction}>Submit</Button>
                </div>
            </div>
        );
    }
}

export default ConductTransaction;