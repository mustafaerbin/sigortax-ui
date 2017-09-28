import React, {Component} from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import {DataTable} from "primereact/components/datatable/DataTable";
import {Column} from "primereact/components/column/Column";
import {InputText} from "primereact/components/inputtext/InputText";
import Card from "../../card/Card";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import {Dialog} from "primereact/components/dialog/Dialog";
import {Button} from 'primereact/components/button/Button';

export default class Customer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            filters: {},
            selectedCustomer: {}
        }
        this.onFilter = this.onFilter.bind(this);
        this.__addNewCustomer = this.__addNewCustomer.bind(this);
    }

    onFilter(e) {
        this.setState({filters: e.filters});
    }

    __addNewCustomer() {
        this.newCustomer = true;
        this.setState({
            customer: {vin: '', year: '', brand: '', color: ''},
            displayDialog: true
        });
    }


    render() {
        let header =
            <div style={{'textAlign': 'left'}}>
                <i className="fa fa-search" style={{margin: '4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})}
                           placeholder="Genel Arama" size="50"/>
            </div>;

        let footer =
            <div className="ui-helper-clearfix" style={{width: '100%'}}>
                <Button style={{float: 'left'}} icon="fa-plus" label="Ekle" onClick={this.__addNewCustomer}/>
            </div>;

        let dialogFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button icon="fa-close" label="Sil" onClick={this.__delete}/>
                <Button label="Kaydet" icon="fa-check" onClick={this.__save}/>
            </div>;

        return (
            <Card header="Müşteri Yönetimi">
                <div>
                    <div className="content-section implementation">
                        <DataTable value={this.state.customers}
                                   paginator={true} rows={10} header={header}
                                   globalFilter={this.state.globalFilter}
                                   filters={this.state.filters}
                                   selectionMode="single"
                                   footer={footer}
                                   selection={this.state.selectedCustomer}
                                   onSelectionChange={(e) => {
                                       this.setState({selectedCustomer: e.data});
                                   }}
                                   onFilter={this.onFilter}
                        >
                            <Column field="name" header="İsim" filter={true}/>
                            <Column field="surname" header="Soyisim" filter={true}/>
                            <Column field="mobilePhone" header="Telefon" filter={true}/>
                            <Column field="email" header="Mail" filter={true}/>
                            <Column header="İşlemler">

                            </Column>
                        </DataTable>
                    </div>

                    <div>
                        <Dialog visible={this.state.displayDialog}
                                header="Müşteri ekle / güncelle" modal={true}
                                onHide={() => this.setState({displayDialog: false})}>

                        </Dialog>

                    </div>

                </div>
            </Card>
        );
    }


    __save() {
        let customers = [...this.state.customers];
        if (this.newCustomer)
            customers.push(this.state.customer);
        else
            customers[this.__findSelectedCarIndex()] = this.state.customer;

        this.setState({customers: customers, selectedCustomer: null, car: null, displayDialog: false});
    }

    __delete() {
        let index = this.__findSelectedCarIndex();
        this.setState({
            customers: this.state.customers.filter((val, i) => i !== index),
            selectedCar: null,
            car: null,
            displayDialog: false
        });
    }

    __findSelectedCarIndex() {
        return this.state.customers.indexOf(this.state.selectedCustomer);
    }

    __getAllCustomer() {

        let request = new AjaxRequest({
            url: "customer",
            type: "GET"
        });

        request.call(undefined, undefined,
            (response) => {
                this.setState({customers: response});
            });
    }

    componentDidMount() {
        this.__getAllCustomer();
    }

}