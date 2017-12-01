import React, {Component} from "react";
import {Application, ShallowComponent} from "robe-react-commons";
import {DataTable} from "primereact/components/datatable/DataTable";
import {Column} from "primereact/components/column/Column";
import {InputText} from "primereact/components/inputtext/InputText";
import Card from "../../card/Card";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import {Button} from 'primereact/components/button/Button';
import {Modal} from "react-bootstrap";
import FaIcon from "robe-react-ui/lib/faicon/FaIcon";
import {Dropdown} from 'primereact/components/dropdown/Dropdown';
import Toast from "robe-react-ui/lib/toast/Toast";
import {Tooltip} from 'primereact/components/tooltip/Tooltip';
import {InputSwitch} from 'primereact/components/inputswitch/InputSwitch';

export default class CompanyPolicyType extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedCompanyPolicyType: {},
            filters: {},
            companyPolicyTypeList: [],
            companyPolicyType: null
        };

        this.onFilter = this.onFilter.bind(this);
        this.__newCompanyPolicyTypeButton = this.__newCompanyPolicyTypeButton.bind(this);
        this.__saveCompanyPolicyType = this.__saveCompanyPolicyType.bind(this);
        this.__actionTemplate = this.__actionTemplate.bind(this);
    }

    onFilter(e) {
        this.setState({filters: e.filters});
    }

    // Girdin sonunda ki işlemler colonu
    __actionTemplate(rowData, column) {
        return (
            <div className="ui-helper-clearfix" style={{width: '100%'}}>
                <Tooltip for="#editButton" title="Güncelle" tooltipPosition="top"/>
                <Button id="editButton" type="button" icon="fa-edit" className="ui-button-warning"
                        onClick={(rowData) => {
                            this.__editButton(rowData, column)
                        }}>
                </Button>
            </div>
        );
    }

    __editButton(rowData, column) {
        this.newCompanyPolicyType = false;
        let selectedCompanyPolicyType = column.rowData;
        let company = selectedCompanyPolicyType.company.label;
        this.setState({
            company: company,
            displayDialog: true,
            companyPolicyType: selectedCompanyPolicyType,
            headerDialog: "Müşteri Bilgileri Güncelle"
        });

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
                <Button id="__newCustomerButton" style={{float: 'left'}} icon="fa-plus" label="Şirket Alt Ürünü"
                        onClick={this.__newCompanyPolicyTypeButton}
                        className="ui-button-success"/>
            </div>;
        let dialogFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button label="Kaydet" icon="fa-check" onClick={this.__saveCompanyPolicyType}
                        className="ui-button-success"/>
                <Button icon="fa-close" label="İptal"
                        onClick={() => {
                            this.setState({displayDialog: false});
                        }}
                />
            </div>;
        return (
            <Card header="Şirket Pöliçe Türü Yönetimi">
                <div>
                    <div className="content-section implementation">
                        {this.state.companyPolicyTypeList ? this.state.companyPolicyTypeList.length : 0} kayıt bulundu
                        <DataTable value={this.state.companyPolicyTypeList}
                                   paginator={true} rows={10} header={header}
                                   globalFilter={this.state.globalFilter}
                                   filters={this.state.filters}
                                   selectionMode="single"
                                   footer={tableFooter}
                                   selection={this.state.selectedCompanyPolicyType}
                            // onSelectionChange={(e) => {
                            //     this.setState({selectedCustomer: e.data, policyAddButtonDisable: false});
                            // }}
                                   onSelectionChange={(e) => {
                                       this.__onSelectionChange(e.data)
                                   }}
                                   onFilter={this.onFilter}
                        >
                            <Column field="company.label" header="Şirket" filter={true}/>
                            <Column field="label" header="Şirket Alt Ürünü" filter={true}/>
                            <Column field="status" header="Durum" body={this.__statusRow}>
                            </Column>
                            <Column header="İşlemler" body={this.__actionTemplate}
                                    style={{textAlign: 'center', width: '7em'}}>
                            </Column>
                        </DataTable>
                    </div>

                    {/*//kaydet ve güncelle button*/}
                    <div className="content-section implementation">
                        <Modal show={this.state.displayDialog}
                               onHide={() => {
                                   this.setState({displayDialog: false})
                               }}>
                            <Modal.Header>
                                <Modal.Title>{this.state.headerDialog}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {
                                    this.state.companyPolicyType &&
                                    <div className="ui-grid ui-grid-responsive ui-fluid">

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="company">Şirket</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <Dropdown
                                                    value={this.state.company}
                                                    options={this.state.companyList}
                                                    onChange={(e) => {
                                                        this.__handleChangeDropDown("company", e)
                                                    }}
                                                    style={{width: 'ui-grid-col-8'}}
                                                    placeholder="Şirket Seçiniz"
                                                    editable={true}
                                                    filter={true}
                                                    filterPlaceholder="Şirket Ara"
                                                    filterBy="label,value"
                                                />
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="label">Şirket Poliçe Türü</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="label" onChange={(e) => {
                                                    this.__updateProperty('label', e.target.value)
                                                }} value={this.state.companyPolicyType.label}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="status">Durum</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputSwitch id="status"
                                                             onLabel="Aktif" offLabel="Pasif"
                                                             checked={this.state.companyPolicyType.status}
                                                             onChange={(e) => {
                                                                 this.__updateProperty('status', e.value)
                                                             }}/>
                                            </div>
                                        </div>

                                    </div>
                                }
                            </Modal.Body>
                            <Modal.Footer>
                                {dialogFooter}
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </Card>
        );
    }

    __updateProperty(property, value) {
        let companyPolicyType = this.state.companyPolicyType;
        companyPolicyType[property] = value;
        this.setState({companyPolicyType: companyPolicyType});
    }

    __handleChangeDropDown(property, e) {
        let value = e.value;
        const companyPolicyType = this.state.companyPolicyType;
        switch (property) {
            case "company":
                const selected1 = this.state.companyList.find(o => o.value === value);
                companyPolicyType[property] = selected1;
                break;
        }
        this.setState({companyPolicyType: companyPolicyType});
    }

    __newCompanyPolicyTypeButton() {

        this.__getAllCompany();
        this.newCompanyPolicyType = true;
        let companyPolicyType = {
            label: "",
            status: true,
            company: {}
        };
        this.setState({
            companyPolicyType: companyPolicyType,
            displayDialog: true,
            headerDialog: "Yeni Poliçe Türü Kaydet"
        });
    }

    __saveCompanyPolicyType() {
        // let customerList = [...this.state.customerList];
        let type = "";
        if (this.newCompanyPolicyType) {
            type = "POST";
        } else {
            type = "PUT";
        }
        this.request = new AjaxRequest({
            url: "company-policy-type",
            type: type
        });
        this.request.call(this.state.companyPolicyType, undefined, function (response) {
            if (response != null) {
                Toast.success("Kayıt Başarılı");
                this.__getAllCompanyPolicyType();
                this.setState({selectedCompanyPolicyType: null, displayDialog: false});
            } else {
                Toast.error("Kayıt Başarısız")
            }
            this.__getAllCompanySubProduct();
            this.forceUpdate();
        }.bind(this));
    }

    __statusRow(column) {
        if (column.status)
            return <td><FaIcon code={"fa-check-square-o "}/></td>;
        else
            return <td><FaIcon code={"fa-square-o "}/></td>;
    }

    __onSelectionChange(date) {
        this.setState({selectedCompanyPolicyType: date});
    }

    __getAllCompany() {
        let request = new AjaxRequest({
            url: "company",
            type: "GET"
        });

        request.call(undefined, undefined, function (response) {
            if (response != null) {
                this.setState({companyList: response, loading: false});
            }
            this.forceUpdate();
        }.bind(this));
    }

    __getAllCompanyPolicyType() {
        let request = new AjaxRequest({
            url: "company-policy-type",
            type: "GET"
        });

        request.call(undefined, undefined, function (response) {
            if (response != null) {
                this.setState({companyPolicyTypeList: response});
            }
            this.forceUpdate();
        }.bind(this));
    }

    componentDidMount() {
        this.__getAllCompanyPolicyType();
    }


}