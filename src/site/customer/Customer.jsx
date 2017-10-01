import React, {Component} from "react";
import {Application, ShallowComponent} from "robe-react-commons";
import {DataTable} from "primereact/components/datatable/DataTable";
import {Column} from "primereact/components/column/Column";
import {InputText} from "primereact/components/inputtext/InputText";
import Card from "../../card/Card";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import {Dialog} from "primereact/components/dialog/Dialog";
import {Button} from 'primereact/components/button/Button';
import {Tooltip} from 'primereact/components/tooltip/Tooltip';
import {InputTextarea} from 'primereact/components/inputtextarea/InputTextarea';
import Toast from "robe-react-ui/lib/toast/Toast";
import {Dropdown} from 'primereact/components/dropdown/Dropdown';
import ReSelectInput from "../../components/selectinput/ReSelectInput";
import {Modal} from "react-bootstrap";

export default class Customer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customerList: [],
            filters: {},
            selectedCustomer: {},
            policyAddButtonDisable: true,
            policy: null,
            company: {}
        };
        this.__save = this.__save.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.__newCustomerButton = this.__newCustomerButton.bind(this);
        this.__actionTemplate = this.__actionTemplate.bind(this);
        this.onPolicyCompanyChange = this.onPolicyCompanyChange.bind(this);
        this.__updateProperty = this.__updateProperty.bind(this);
        this.__addPolicyButton = this.__addPolicyButton.bind(this);
        this.__handleChangeReSelectInputProductList = this.__handleChangeReSelectInputProductList.bind(this);
        this.__handleChangecompanySubProductList = this.__handleChangecompanySubProductList.bind(this);


    }

    onFilter(e) {
        this.setState({filters: e.filters});
    }

    onPolicyCompanyChange(e) {
        this.setState({company: e});
    }

    // Girdin sonunda ki işlemler colonu
    __actionTemplate(rowData, column) {
        return (
            <div className="ui-helper-clearfix" style={{width: '100%'}}>
                <Tooltip for="#detailButton" title="Detay" tooltipPosition="top"/>
                <Button id="detailButton" type="button" icon="fa-search" className="ui-button-info"
                        onClick={(rowData) => {
                            this.__detailButton(rowData, column)
                        }}>
                </Button>
                <Tooltip for="#editButton" title="Güncelle" tooltipPosition="top"/>
                <Button id="editButton" type="button" icon="fa-edit" className="ui-button-warning"
                        onClick={(rowData) => {
                            this.__editButton(rowData, column)
                        }}>
                </Button>
                <Tooltip for="#deleteButton" title="Sil" tooltipPosition="top"/>
                <Button id="deleteButton" type="button" icon="fa-trash" className="ui-button-danger">
                </Button>
            </div>
        );
    }

    render() {
        let header =
            <div style={{'textAlign': 'left'}}>
                <i className="fa fa-search" style={{margin: '4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})}
                           placeholder="Genel Arama" size="50"/>
            </div>;

        let tableFooter =
            <div className="ui-helper-clearfix" style={{width: '100%'}}>
                <Button id="__newCustomerButton" style={{float: 'left'}} icon="fa-plus" label="Yeni Müşteri"
                        onClick={this.__newCustomerButton}
                        className="ui-button-success"/>
                <Button style={{float: 'left'}} icon="fa-plus" label="Poliçe Ekle" onClick={this.__addPolicyButton}
                        disabled={this.state.policyAddButtonDisable}
                        className="ui-button-success"/>
            </div>;

        let dialogFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button label="Kaydet" icon="fa-check" onClick={this.__save}
                        className="ui-button-success"/>
                <Button icon="fa-close" label="İptal"
                        onClick={() => {
                            this.setState({displayDialog: false});
                        }}
                />
            </div>;

        let dialogFooterDetail =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button icon="fa-close" label="Kapat"
                        onClick={() => {
                            this.setState({displayDialogDetail: false});
                        }}
                />
            </div>


        let dialogPolicyFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button label="Kaydet" icon="fa-check" onClick={this.__savePolicy}
                        className="ui-button-success"/>
                <Button icon="fa-close" label="İptal"
                        onClick={() => {
                            this.setState({displayDialogPolicy: false});
                        }}
                />
            </div>;

        return (
            <Card header="Müşteri Yönetimi">
                <div>
                    <div className="content-section implementation">
                        <DataTable value={this.state.customerList}
                                   paginator={true} rows={10} header={header}
                                   globalFilter={this.state.globalFilter}
                                   filters={this.state.filters}
                                   selectionMode="single"
                                   footer={tableFooter}
                                   selection={this.state.selectedCustomer}
                            // onSelectionChange={(e) => {
                            //     this.setState({selectedCustomer: e.data, policyAddButtonDisable: false});
                            // }}
                                   onSelectionChange={(e) => {
                                       this.__onSelectionChange(e.data)
                                   }}
                                   onFilter={this.onFilter}
                        >
                            <Column field="name" header="İsim" filter={true}/>
                            <Column field="surname" header="Soyisim" filter={true}/>
                            <Column field="mobilePhone" header="Telefon" filter={true}/>
                            <Column field="email" header="E-Mail" filter={true}/>
                            <Column header="İşlemler" body={this.__actionTemplate}
                                    style={{textAlign: 'center', width: '8em'}}>

                            </Column>
                        </DataTable>
                    </div>

                    {/*güncelle ve kaydet popup*/}
                    <div className="content-section implementation">

                        {
                            this.state.customer &&
                            <Modal show={this.state.displayDialog}
                                   onHide={false}>
                                <Modal.Header>
                                    <Modal.Title>{this.state.headerDialog}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="ui-grid ui-grid-responsive ui-fluid">
                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="name">İsim</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="name" onChange={(e) => {
                                                    this.__updateProperty('name', e.target.value)
                                                }} value={this.state.customer.name}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="surname">Soyisim</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="surname" onChange={(e) => {
                                                    this.__updateProperty('surname', e.target.value)
                                                }} value={this.state.customer.surname}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="mobilePhone">Mobil Tel</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="mobilePhone" onChange={(e) => {
                                                    this.__updateProperty('mobilePhone', e.target.value)
                                                }} value={this.state.customer.mobilePhone}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="email">E-Mail</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="email" onChange={(e) => {
                                                    this.__updateProperty('email', e.target.value)
                                                }} value={this.state.customer.email}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="tc">TC Kimlik No</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="tc" onChange={(e) => {
                                                    this.__updateProperty('tc', e.target.value)
                                                }} value={this.state.customer.tc}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="job">Meslek</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="job" onChange={(e) => {
                                                    this.__updateProperty('job', e.target.value)
                                                }} value={this.state.customer.job}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="address">Adres</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputTextarea id="address" onChange={(e) => {
                                                    this.__updateProperty('address', e.target.value)
                                                }} value={this.state.customer.address}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="description">Açıklama</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputTextarea id="description" onChange={(e) => {
                                                    this.__updateProperty('description', e.target.value)
                                                }} value={this.state.customer.description}/>
                                            </div>
                                        </div>

                                    </div>

                                </Modal.Body>

                                <Modal.Footer>
                                    {dialogFooter}
                                </Modal.Footer>

                            </Modal>
                        }
                    </div>
                    {/*detay popup*/}
                    <div className="content-section implementation">
                        <Modal show={this.state.displayDialogDetail}
                               onHide={false}>
                            <Modal.Header>
                                <Modal.Title>{this.state.headerDialog}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {
                                    this.state.customer &&
                                    <div className="ui-grid ui-grid-responsive ui-fluid">

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="name">İsim</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.name}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="surname">Soyisim</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.surname}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="mobilePhone">Mobil Tel</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.mobilePhone}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="email">E-Mail</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.email}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="tc">TC Kimlik No</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.tc}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="job">Meslek</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.job}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="address">Adres</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.address}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="description">Açıklama</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.description}
                                            </div>
                                        </div>

                                    </div>
                                }
                            </Modal.Body>

                            <Modal.Footer>
                                {dialogFooterDetail}
                            </Modal.Footer>

                        </Modal>
                    </div>
                    {/*poliçe ekle popup*/}
                    <div className="content-section implementation">
                        <Modal show={this.state.displayDialogPolicy}
                               onHide={false}>
                            <Modal.Header>
                                <Modal.Title>Poliçe Ekle</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {
                                    this.state.policy && <div className="ui-grid ui-grid-responsive ui-fluid">

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="musteri">Müşteri</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.customer.name}{' '}{this.state.policy.customer.surname}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="companyList">Sigorta Şirketi</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <ReSelectInput
                                                    id="companyList"
                                                    name="name"
                                                    items={this.state.companyList}
                                                    textField="name"
                                                    valueField="id"
                                                    value={this.state.policy.company}
                                                    onChange={this.__handleChangeReSelectInputProductList}
                                                />
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="companyProductList">Şirket Ürünü</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <ReSelectInput
                                                    id="companyProductList"
                                                    name="name"
                                                    items={this.state.companyProductList}
                                                    textField="name"
                                                    valueField="id"
                                                    value={this.state.policy.companyProduct}
                                                    onChange={this.__handleChangecompanySubProductList}
                                                />
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="companySubProductList">Şirket Alt Ürünü</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <ReSelectInput
                                                    id="companySubProductList"
                                                    name="name"
                                                    items={this.state.companySubProductList}
                                                    textField="name"
                                                    valueField="id"
                                                    value={this.state.policy.companySubProduct}
                                                    onChange={this.__handleChangeReSelectInput}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                }
                            </Modal.Body>

                            <Modal.Footer>
                                {dialogPolicyFooter}
                            </Modal.Footer>

                        </Modal>


                        {/*<Dialog visible={this.state.displayDialogPolicy}*/}
                        {/*footer={dialogPolicyFooter}*/}
                        {/*width="550px"*/}
                        {/*header={this.state.headerDialog}*/}
                        {/*modal={true}*/}
                        {/*onHide={() => this.setState({displayDialogPolicy: false})}*/}
                        {/*>*/}
                        {/*{*/}
                        {/*this.state.policy && <div className="ui-grid ui-grid-responsive ui-fluid">*/}

                        {/*<div className="ui-grid-row">*/}
                        {/*<div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label*/}
                        {/*htmlFor="companyList">Sigorta Şirketi</label></div>*/}
                        {/*<div className="ui-grid-col-8" style={{padding: '4px 10px'}}>*/}
                        {/*<ReSelectInput*/}
                        {/*id="companyList"*/}
                        {/*name="name"*/}
                        {/*items={this.state.companyList}*/}
                        {/*textField="name"*/}
                        {/*valueField="id"*/}
                        {/*value={this.state.policy.company}*/}
                        {/*onChange={this.__handleChangeReSelectInputProductList}*/}
                        {/*/>*/}
                        {/*</div>*/}
                        {/*</div>*/}

                        {/*<div className="ui-grid-row">*/}
                        {/*<div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label*/}
                        {/*htmlFor="companyProductList">Şirket Ürünü</label></div>*/}
                        {/*<div className="ui-grid-col-8" style={{padding: '4px 10px'}}>*/}
                        {/*<ReSelectInput*/}
                        {/*id="companyProductList"*/}
                        {/*name="name"*/}
                        {/*items={this.state.companyProductList}*/}
                        {/*textField="name"*/}
                        {/*valueField="id"*/}
                        {/*value={this.state.policy.companyProduct}*/}
                        {/*onChange={this.__handleChangecompanySubProductList}*/}
                        {/*/>*/}
                        {/*</div>*/}
                        {/*</div>*/}

                        {/*<div className="ui-grid-row">*/}
                        {/*<div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label*/}
                        {/*htmlFor="companySubProductList">Şirket Alt Ürünü</label></div>*/}
                        {/*<div className="ui-grid-col-8" style={{padding: '4px 10px'}}>*/}
                        {/*<ReSelectInput*/}
                        {/*id="companySubProductList"*/}
                        {/*name="name"*/}
                        {/*items={this.state.companySubProductList}*/}
                        {/*textField="name"*/}
                        {/*valueField="id"*/}
                        {/*value={this.state.policy.companySubProduct}*/}
                        {/*onChange={this.__handleChangeReSelectInput}*/}
                        {/*/>*/}
                        {/*</div>*/}
                        {/*</div>*/}

                        {/*</div>*/}
                        {/*}*/}

                        {/*</Dialog>*/}
                    </div>

                </div>
            </Card>
        );
    }

    __updateProperty(property, value) {
        let customer = this.state.customer;
        customer[property] = value;
        this.setState({customer: customer});
    }

    // Giridin altındaki yeni müşteri ekle Butonu
    __newCustomerButton() {
        this.newCustomer = true;
        this.setState({
            customer: {
                name: '',
                surname: '',
                tc: '',
                job: '',
                email: '',
                mobilePhone: '',
                address: '',
                status: true,
                description: ''
            },
            displayDialog: true,
            headerDialog: "Yeni Müşteri Kaydet"
        });
    }

    __addPolicyButton() {

        this.__getAllCompany();
        this.setState({
            policy: {
                customer: this.state.selectedCustomer,
                company: {},
                companyProduct: {},
                companySubProduct: {},
                startDate: null
            },
            displayDialogPolicy: true,
            headerDialog: "Poliçe Ekle"
        });
    }

    __handleChangeReSelectInput(e) {
        let state = {};
        let value = e.target.parsedValue !== undefined ? e.target.parsedValue : e.target.value;
        state[e.target.name] = value;
        this.setState(state);
    }

    __handleChangeReSelectInputProductList(e) {
        let state = {};
        let value = e.target.parsedValue !== undefined ? e.target.parsedValue : e.target.value;
        this.__getAllCompanyProduct(value);
        state[e.target.name] = value;
        this.setState(state);
    }

    __handleChangecompanySubProductList(e) {
        let state = {};
        let value = e.target.parsedValue !== undefined ? e.target.parsedValue : e.target.value;
        state[e.target.name] = value;
        this.__getAllCompanySubProduct(value);
        this.setState(state);
    }

    __onSelectionChange(date) {
        this.setState({selectedCustomer: date, policyAddButtonDisable: false});
    }


    __detailButton(rowData, column) {
        let a = 4;
        let selectedCustomer = column.rowData;
        this.setState({
            displayDialogDetail: true,
            customer: selectedCustomer,
            headerDialog: "Müşteri Bilgileri Detay"
        })
    }

    __editButton(rowData, column) {
        this.newCustomer = false;
        let selectedCustomer = column.rowData;
        this.setState({
            displayDialog: true,
            customer: selectedCustomer,
            headerDialog: "Müşteri Bilgileri Güncelle"
        });

    }

    __save() {
        // let customerList = [...this.state.customerList];
        let type = "";
        if (this.newCustomer) {
            type = "POST";
        } else {
            type = "PUT";
        }
        this.request = new AjaxRequest({
            url: "customer",
            type: type
        });
        this.request.call(this.state.customer, undefined, function (response) {
            if (response != null) {
                Toast.success("Kayıt Başarılı");
            } else {
                Toast.error("Kayıt Başarısız")
            }
            this.__getAllCustomer();
            this.forceUpdate();
        }.bind(this));
        // customerList[this.__findSelectedCarIndex()] = this.state.customer;
        this.setState({selectedCustomer: null, displayDialog: false});
    }

    __savePolicy() {

    }

    __delete() {
        let index = this.__findSelectedCarIndex();
        this.setState({
            customerList: this.state.customerList.filter((val, i) => i !== index),
            selectedCar: null,
            car: null,
            displayDialog: false,
            displayDialogDetail: false
        });
    }

    __findSelectedCarIndex() {
        return this.state.customerList.indexOf(this.state.selectedCustomer);
    }

    __getAllCustomer() {

        let request = new AjaxRequest({
            url: "customer",
            type: "GET"
        });

        request.call(undefined, undefined, function (response) {
            if (response != null) {
                this.setState({customerList: response});
            }
            this.forceUpdate();
        }.bind(this));
    }

    __getAllCompany() {
        let request = new AjaxRequest({
            url: "company",
            type: "GET"
        });
        request.call(undefined, undefined,
            (response) => {
                this.setState({companyList: response});
            });
    }

    __getAllCompanyProduct(company) {
        let request = new AjaxRequest({
            url: "company/list-company-product",
            type: "POST"
        });
        request.call(company, undefined,
            (response) => {
                this.setState({companyProductList: response});
            });
    }

    __getAllCompanySubProduct(companyProduct) {
        let request = new AjaxRequest({
            url: "company/list-company-sub-product",
            type: "POST"
        });

        request.call(companyProduct, undefined,
            (response) => {
                this.setState({companySubProductList: response});
            });
    }

    componentDidMount() {
        this.__getAllCustomer();
    }

}