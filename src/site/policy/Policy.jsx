import React, {Component} from "react";
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
import CompanySubProduct from "../../parameter/companySubProduct/CompanySubProduct";
import Calendar from "../../components/calendar/CalendarTR";
//import {Calendar} from 'primereact/components/calendar/Calendar';
import {FileUpload} from 'primereact/components/fileupload/FileUpload';
import FaIcon from "robe-react-ui/lib/faicon/FaIcon";

export default class Policy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filters: {},
            selectedPolicy: {}
        }

        this.onFilter = this.onFilter.bind(this);
        this.__actionTemplate = this.__actionTemplate.bind(this);
    }

    onFilter(e) {
        this.setState({filters: e.filters});
    }

    // Girdin sonunda ki işlemler colonu
    __actionTemplate(rowData, column) {
        return (
            <div className="ui-helper-clearfix" style={{width: '100%'}}>
                <Tooltip for="#detailButton" title="Detay" tooltipPosition="top"/>
                <Button id="detailButton" type="button" icon="fa-search" className="ui-button-info"
                        onClick={(rowData) => {
                            this.__detailButtonPolicy(rowData, column)
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

        let dialogFooterDetail =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button icon="fa-close" label="Kapat"
                        onClick={() => {
                            this.setState({displayDialogDetail: false});
                        }}
                />
            </div>

        let tableFooter =
            <div className="ui-helper-clearfix" style={{width: '100%'}}>
                <Button id="__newCustomerButton" style={{float: 'left'}} icon="fa-plus" label="Yeni Müşteri"
                        onClick={this.__newCustomerButton}
                        className="ui-button-success"/>
                <Button style={{float: 'left'}} icon="fa-plus" label="Poliçe Ekle" onClick={this.__addPolicyButton}
                        disabled={this.state.policyAddButtonDisable}
                        className="ui-button-success"/>
            </div>;

        let dialogPolicyFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button label="Kaydet" icon="fa-check" onClick={this.__savePolicy}
                        className="ui-button-success"/>
                <Button icon="fa-close" label="İptal"
                        onClick={() => {
                            this.setState({displayDialogEdit: false});
                        }}
                />
            </div>;

        return (
            <Card header="Poliçe Yönetimi">
                <div>
                    <div className="content-section implementation">
                        <DataTable value={this.state.policyList}
                                   paginator={true} rows={10} header={header}
                                   globalFilter={this.state.globalFilter}
                                   filters={this.state.filters}
                                   selectionMode="single"
                                   footer={tableFooter}
                                   selection={this.state.selectedPolicy}
                            // onSelectionChange={(e) => {
                            //     this.setState({selectedCustomer: e.data, policyAddButtonDisable: false});
                            // }}
                                   onSelectionChange={(e) => {
                                       this.__onSelectionChange(e.data)
                                   }}
                                   onFilter={this.onFilter}
                        >
                            <Column field="customer.name" header="İsim" filter={true}/>
                            <Column field="customer.surname" header="Soyisim" filter={true}/>
                            <Column field="company.label" header="Şirket" filter={true}/>
                            <Column field="companySubProduct.label" header="Şirket ürünü" filter={true}/>
                            <Column field="startDate" header="Başlangıç Tarihi" filter={true}/>
                            <Column field="endDate" header="Bitiş Tarihi" filter={true}/>
                            <Column header="İşlemler" body={this.__actionTemplate}
                                    style={{textAlign: 'center', width: '8em'}}>

                            </Column>
                        </DataTable>
                    </div>

                    {/*poliçe detay popup*/}
                    <div className="content-section implementation">
                        <Modal show={this.state.displayDialogDetail}
                               onHide={false}>
                            <Modal.Header>
                                <Modal.Title>{this.state.headerDialog}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {
                                    this.state.policy &&
                                    <div className="ui-grid ui-grid-responsive ui-fluid">

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="name">İsim</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.customer.name}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="surname">Soyisim</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.customer.surname}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="mobilePhone">Mobil Tel</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.customer.mobilePhone}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="email">E-Mail</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.customer.email}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="company">Şirket</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.company.label}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="companyProduct">Şirket Ürünü</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.companyProduct.label}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="companySubProduct">Şirket Alt Ürünü</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.companySubProduct.label}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="startDate">Poliçe Başlangıç tarihi</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.startDate}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="endDate">Poliçe Bitiş Tarihi</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.endDate}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="endDate">Poliçe Hatırlatma Tarihi</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.reminderDate}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="userMessage">Poliçe Hatırlatma Mesajı</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.userMessage}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="policyNumber">Poliçe Numarası</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.policyNumber}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="policyEmount">Poliçe Tutarı</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.policyEmount}
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

                    {/*güncelle ve kaydet popup*/}
                    <div className="content-section implementation">
                        <Modal show={this.state.displayDialogEdit}
                               onHide={false}>
                            <Modal.Header>
                                <Modal.Title>Poliçe Güncelle</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {
                                    this.state.policy && <div className="ui-grid ui-grid-responsive ui-fluid">

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="company">Şirket</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <Dropdown
                                                    value={this.state.policy.company.label}
                                                    options={this.state.companyList}
                                                    onChange={(e) => {
                                                        this.__handleChangeDropDownCompany("company", e)
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
                                                htmlFor="companyProduct">Şirket Ürünü</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <Dropdown value={this.state.policy.companyProduct.label}
                                                          options={this.state.companyProductList}
                                                          onChange={(e) => {
                                                              this.__handleChangeDropDownCompany("companyProduct", e)
                                                          }}
                                                          style={{width: 'ui-grid-col-8'}}
                                                          placeholder="Ürün Seçiniz"
                                                          editable={true}
                                                          filter={true}
                                                          filterPlaceholder="Ürün Ara"
                                                          filterBy="label,value"
                                                />
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="companySubProduct">Şirket Alt Ürünü</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <Dropdown value={this.state.policy.companySubProduct.label}
                                                          options={this.state.companySubProductList}
                                                          onChange={(e) => {
                                                              this.__handleChangeDropDownCompany("companySubProduct", e)
                                                          }}
                                                          style={{width: 'ui-grid-col-8'}}
                                                          placeholder="Alt Ürün Seçiniz"
                                                          editable={true}
                                                          filter={true}
                                                          filterPlaceholder="Alt Ürün Ara"
                                                          filterBy="label,value"
                                                />
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="reminderDate">Poliçe Hatırlatma Tarihi</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <Calendar
                                                    id="reminderDate"
                                                    value={this.state.policy.reminderDate}
                                                    onChange={(e) => {
                                                        this.__calendarOnChange("reminderDate", e)
                                                    }}
                                                >
                                                </Calendar>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="userMessage">Poliçe Hatırlatıcı Mesaj</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputTextarea id="userMessage" onChange={(e) => {
                                                    this.__updatePropertyPolicy('userMessage', e.target.value)
                                                }} value={this.state.policy.userMessage}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="policyNumber">Poliçe Numarası</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="policyNumber" onChange={(e) => {
                                                    this.__updatePropertyPolicy('policyNumber', e.target.value)
                                                }} value={this.state.policy.policyNumber}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="policyEmount">Poliçe Tutarı</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="policyEmount" onChange={(e) => {
                                                    this.__updatePropertyPolicy('policyEmount', e.target.value)
                                                }} value={this.state.policy.policyEmount}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="description">Açıklama</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputTextarea id="description" onChange={(e) => {
                                                    this.__updatePropertyPolicy('description', e.target.value)
                                                }} value={this.state.policy.description}/>
                                            </div>
                                        </div>

                                    </div>

                                }
                            </Modal.Body>

                            <Modal.Footer>
                                {dialogPolicyFooter}
                            </Modal.Footer>

                        </Modal>
                    </div>

                </div>
            </Card>
        );
    }

    __updatePropertyPolicy(property, value) {
        let policy = this.state.policy;
        policy[property] = value;
        this.setState({policy: policy});
    }

    __calendarOnChange(property, e) {
        let value = e.value;
        let policy = this.state.policy;
        policy[property] = value;
        if (property === "endDate") {
            var days = 7; // Days you want to subtract
            const DAY_IN_MS = 1000 * 60 * 60 * 24;
            let reminderDate = new Date(value.getTime() - (days * DAY_IN_MS))
            policy["reminderDate"] = reminderDate;
        } else if (property === "startDate") {
            var days = 365;
            const DAY_IN_MS = 1000 * 60 * 60 * 24;
            let endDate = new Date(value.getTime() + (days * DAY_IN_MS))
            policy["endDate"] = endDate;
        }
        this.setState({policy: policy});
    }

    __onSelectionChange(date) {
        this.setState({selectedPolicy: date, policyAddButtonDisable: false});
    }

    __detailButtonPolicy(rowData, column) {
        let selectedPolicy = column.rowData;
        this.setState({
            displayDialogDetail: true,
            policy: selectedPolicy,
            headerDialog: "Poliçe Bilgileri Detay"
        })
    }

    __editButton(rowData, column) {
        let selectedPolicy = column.rowData;
        this.__getAllCompany();
        this.setState({
            displayDialogEdit: true,
            policy: selectedPolicy,
            headerDialog: "Poliçe Bilgileri Güncelle"
        });
    }

    __handleChangeDropDownCompany(property, e) {
        let value = e.value;
        let selected = this.state.companyList.find(o => o.value === value);
        let policy = this.state.policy;
        policy[property] = selected;
        switch (property) {
            case "company":
                this.__getAllCompanyProduct(selected);
                break;
            case "companyProduct":
                this.__getAllCompanySubProduct(selected);
                break;
            case "companySubProduct":
                break;
        }
        this.setState({policy: policy});
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

    __getAllPolicy() {

        let request = new AjaxRequest({
            url: "policy",
            type: "GET"
        });

        request.call(undefined, undefined, function (response) {
            if (response != null) {
                this.setState({policyList: response, loading: false});
            }
            this.forceUpdate();
        }.bind(this));
    }

    componentDidMount() {
        this.__getAllPolicy();
    }

}