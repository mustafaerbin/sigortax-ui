import React, {Component} from "react";
import {DataTable} from "primereact/components/datatable/DataTable";
import {Column} from "primereact/components/column/Column";
import {InputText} from "primereact/components/inputtext/InputText";
import Card from "../../card/Card";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import {Button} from 'primereact/components/button/Button';
import {Tooltip} from 'primereact/components/tooltip/Tooltip';
import {InputTextarea} from 'primereact/components/inputtextarea/InputTextarea';
import Toast from "robe-react-ui/lib/toast/Toast";
import {Dropdown} from 'primereact/components/dropdown/Dropdown';
import {Modal} from "react-bootstrap";
import Calendar from "../../components/calendar/CalendarTR";
import FaIcon from "robe-react-ui/lib/faicon/FaIcon";
import {SplitButton} from 'primereact/components/splitbutton/SplitButton';


export default class Policy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filters: {},
            selectedPolicy: {},
            loading: true,
            policyList: []
        };

        this.onFilter = this.onFilter.bind(this);
        this.__savePolicy = this.__savePolicy.bind(this);
        this.dateStartTemplate = this.dateStartTemplate.bind(this);
        this.dateEndTemplate = this.dateEndTemplate.bind(this);
        this.__actionTemplateButton = this.__actionTemplateButton.bind(this);
        this.onBrandChange = this.onBrandChange.bind(this);
    }

    // onLazyLoad(event) {
    //     setTimeout(() => {
    //         if (this.datasource) {
    //             this.setState({policyList: this.datasource.slice(event.first, (event.first + event.rows))});
    //         }
    //     }, 250);
    // }

    onFilter(e) {
        this.setState({filters: e.filters});
    };

    dateStartTemplate(rowData, column) {
        return this.__formatDate(new Date(rowData.startDate));
    }

    dateEndTemplate(rowData, column) {
        return this.__formatDate(new Date(rowData.endDate));
    }

    //
    // // Girdin sonunda ki işlemler colonu
    // __actionTemplate(rowData, column) {
    //     return (
    //         <div className="ui-helper-clearfix" style={{width: '100%'}}>
    //             <Tooltip for="#detailButton" title="Detay" tooltipPosition="top"/>
    //             <Button id="detailButton" type="button" icon="fa-search" className="ui-button-info"
    //                     onClick={(rowData) => {
    //                         this.__detailButtonPolicy(rowData, column)
    //                     }}>
    //             </Button>
    //             <Tooltip for="#editButton" title="Güncelle" tooltipPosition="top"/>
    //             <Button id="editButton" type="button" icon="fa-edit" className="ui-button-warning"
    //                     onClick={(rowData) => {
    //                         this.__editButton(rowData, column)
    //                     }}>
    //             </Button>
    //         </div>
    //     );
    // }

    // row'un sonunda ki işlemler butonu
    __actionTemplateButton(rowDate, column) {
        this.items = [
            {
                label: 'Detay', icon: 'fa-search', command: (rowData) => {
                this.__actionButton(rowData, column, "detail")
            }
            },
            {
                label: 'Düzenle', icon: 'fa-edit', command: (rowData) => {
                this.__actionButton(rowData, column, "edit")
            }
            },
            {
                label: 'Güncelle', icon: 'fa-refresh', command: (rowData) => {
                this.__actionButton(rowData, column, "refresh")
            }
            },
            {
                label: 'Sil', icon: 'fa-trash', command: (rowData) => {
                this.__actionButton(rowData, column, "delete")
            }
            }
        ];
        return (
            <div>
                <div className="content-section implementation splitbutton-demo">
                    <SplitButton label="İşlem" model={this.items}
                                 className="ui-button-info">
                    </SplitButton>
                </div>
            </div>
        );
    }

    save() {
        this.setState({messages: [{severity: 'success', summary: 'Success', detail: 'Data Saved'}]});
    }

    onBrandChange(e) {
        let filters = this.state.filters;
        filters['enumPolicyState'] = {value: e.value};
        this.setState({filters: filters});
    }

    // Kayıt'ın aktif pasif durum kolonu style={{textAlign: 'center', width: '5em'}}
    __statusRow(column) {
        if (column.enumPolicyState === "YENILENDI") {
            return (
                <div>
                    <Tooltip for="#check" title="Yenilendi" tooltipPosition="top"/>
                    <div style={{backgroundColor: '#5cb85c', padding: '.25em .5em'}}>
                        <i id="check" className="fa fa-check-square-o " style={{textAlign: 'center', width: '3em'}}/>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div style={{padding: '.25em .5em'}}>
                        <Tooltip for="#nocheck" title="Yenilenmedi" tooltipPosition="top"/>
                        <i id="nocheck" className="fa fa-square-o "/>
                    </div>
                </div>
            );
        }
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
                            this.setState({displayDialogDetail: false, loading: false});
                        }}
                />
            </div>;


        let dialogFooterDelete =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button className="ui-button-danger" label="  Sil  " icon="fa-trash"
                        onClick={this.__savePolicy}
                />
                <Button icon="fa-close" label="Kapat"
                        onClick={() => {
                            this.setState({displayDialogDetail: false, loading: false});
                        }}
                />
            </div>;

        let dialogPolicyFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button label={this.state.addModalButtonLabel} icon="fa-check" onClick={this.__savePolicy}
                        className="ui-button-success"/>
                <Button icon="fa-close" label="İptal"
                        onClick={() => {
                            this.setState({displayDialogEdit: false, loading: false});
                        }}
                />
            </div>;
        let carCount = this.state.policyList ? this.state.policyList.length : 0;
        let footer = carCount + ' kayıt bulundu';

        let brands = [
            {label: 'Seçiniz', value: null},
            {label: 'Yenilendi', value: 'YENILENDI'},
            {label: 'Yenilenmedi', value: 'YENILENMEDI'}
        ];
        let brandFilter =
            <Dropdown className="ui-column-filter"
                      style={{textAlign: 'center', width: '4em'}}
                      value={this.state.filters.enumPolicyState ? this.state.filters.enumPolicyState.value : null}
                      options={brands} onChange={this.onBrandChange}/>

        return (
            <Card header="Poliçe Yönetimi"
                  loading={this.state.loading}>
                <div className="content-section implementation">
                    {this.state.policyList ? this.state.policyList.length : 0} kayıt bulundu
                    <DataTable value={this.state.policyList}
                               paginator={true}
                               rows={15}
                               rowsPerPageOptions={[15, 30, 45]}
                               header={header}
                               globalFilter={this.state.globalFilter}
                               filters={this.state.filters}
                               onFilter={this.onFilter}
                               selection={this.state.selectedPolicy}

                        // totalRecords={this.state.totalRecords}
                        // lazy={true}
                        // onLazyLoad={this.onLazyLoad}
                        // onSelectionChange={(e) => {
                        //     this.setState({selectedCustomer: e.data, policyAddButtonDisable: false});
                        // }}
                               onSelectionChange={(e) => {
                                   this.__onSelectionChange(e.data)
                               }}
                    >
                        <Column field="customerFullName" header="İsim Soyisim" filter={true}/>
                        <Column field="company.label" header="Şirket" filter={true}/>
                        <Column field="companySubProduct.label" header="Şirket ürünü" filter={true}/>
                        <Column field="startDate" header="Başlangıç Tarihi" filter={true}/>
                        <Column field="endDate" header="Bitiş Tarihi" filter={true}/>
                        <Column field="enumPolicyState" header="Durum" body={this.__statusRow}
                                filter={true} filterElement={brandFilter} filterMatchMode="equals"
                                style={{textAlign: 'center', width: '5em'}}/>
                        <Column field="agencyUserFullName" header="Kullanıcı" filter={true}/>
                        <Column header="İşlemler" body={this.__actionTemplateButton}
                                style={{width: '9em'}}>

                        </Column>
                        {/*<Column header="İşlemler" body={this.__actionTemplate}*/}
                        {/*style={{textAlign: 'center', width: '6em'}}>*/}

                        {/*</Column>*/}
                    </DataTable>
                </div>

                {/*poliçe detay popup*/}
                <div className="content-section implementation">
                    <Modal show={this.state.displayDialogDetail}
                           onHide={() => {
                               this.setState({displayDialogDetail: false})
                           }}>
                        <Modal.Header>
                            <Modal.Title>{this.state.headerDialog}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {
                                this.state.policy &&
                                <div className="ui-grid ui-grid-responsive ui-fluid">

                                    <div className="ui-grid-row">
                                        <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                            htmlFor="name">İsim Soyisim</label></div>
                                        <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                            {this.state.policy.customer.name} {" "} {this.state.policy.customer.surname}
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
                                            {this.__formatDate(new Date(this.state.policy.startDate))}
                                        </div>
                                    </div>

                                    <div className="ui-grid-row">
                                        <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                            htmlFor="endDate">Poliçe Bitiş Tarihi</label></div>
                                        <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                            {this.__formatDate(new Date(this.state.policy.endDate))}
                                        </div>
                                    </div>

                                    <div className="ui-grid-row">
                                        <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                            htmlFor="endDate">Poliçe Hatırlatma Tarihi</label></div>
                                        <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                            {this.__formatDate(new Date(this.state.policy.reminderDate))}
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

                                    <div className="ui-grid-row">
                                        <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                            htmlFor="description">Açıklama</label></div>
                                        <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                            {this.state.policy.description}
                                        </div>
                                    </div>

                                </div>
                            }
                        </Modal.Body>

                        <Modal.Footer>
                            {(this.state.type === "detail" ? dialogFooterDetail : dialogFooterDelete)}
                        </Modal.Footer>

                    </Modal>
                </div>

                {/*güncelle ve kaydet popup*/}
                <div className="content-section implementation">
                    <Modal show={this.state.displayDialogEdit}
                           onHide={() => {
                               this.setState({displayDialogEdit: false})
                           }}>
                        <Modal.Header>
                            <Modal.Title>{this.state.headerDialog}</Modal.Title>
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
                                            htmlFor="startDate">Poliçe Başlangıç Tarihi</label></div>
                                        <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                            <Calendar
                                                id="startDate"
                                                value={this.state.startDate}
                                                onChange={(e) => {
                                                    this.__calendarOnChangeDate("startDate", e)
                                                }}
                                            >
                                            </Calendar>
                                        </div>
                                    </div>

                                    <div className="ui-grid-row">
                                        <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                            htmlFor="endDate">Poliçe Bitiş Tarihi</label></div>
                                        <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                            <Calendar
                                                id="endDate"
                                                value={this.state.endDate}
                                                onChange={(e) => {
                                                    this.__calendarOnChangeDate("endDate", e)
                                                }}
                                            >
                                            </Calendar>
                                        </div>
                                    </div>

                                    <div className="ui-grid-row">
                                        <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                            htmlFor="reminderDate">Poliçe Hatırlatma Tarihi</label></div>
                                        <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                            <Calendar
                                                id="reminderDate"
                                                value={this.state.reminderDate}
                                                onChange={(e) => {
                                                    this.__calendarOnChangeDate("reminderDate", e)
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

                <br/><br/><br/><br/>
            </Card>
        );
    }

    __formatDate(d) {
        let month = String(d.getMonth() + 1);
        let day = String(d.getDate());
        const year = String(d.getFullYear());

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return `${year}-${month}-${day}`;
    }

    __savePolicy() {

        switch (this.state.type) {
            case"edit":
                const policy = this.state.policy;
                policy["startDate"] = this.__formatDate(this.state.startDate);
                policy["endDate"] = this.__formatDate(this.state.endDate);
                policy["reminderDate"] = this.__formatDate(this.state.reminderDate);

                this.request = new AjaxRequest({
                    url: "policy",
                    type: "PUT"
                });
                this.request.call(policy, undefined, function (response) {
                    if (response != null) {
                        Toast.success("Kayıt Başarılı");
                        this.__getAllPolicy();
                    } else {
                        Toast.error("Kayıt Başarısız");
                    }
                    this.setState({
                        policy: null,
                        displayDialogEdit: false,
                        loading: false
                    });
                    this.forceUpdate();
                }.bind(this));
                break;
            case"delete":
                this.request = new AjaxRequest({
                    url: "policy/" + this.state.policy.id,
                    type: "GET"
                });
                this.request.call(undefined, undefined, function (response) {
                    if (response != null) {
                        Toast.success("Kayıt Başarılı");
                        this.__getAllPolicy();
                    } else {
                        Toast.error("Kayıt Başarısız")
                    }
                    this.setState({
                        policy: null,
                        displayDialogDetail: false,
                        loading: false
                    });
                    this.forceUpdate();
                }.bind(this));
                break;
            case "refresh":
                const policyRefresh = this.state.policy;
                policyRefresh.id = null;
                policyRefresh["startDate"] = this.__formatDate(this.state.startDate);
                policyRefresh["endDate"] = this.__formatDate(this.state.endDate);
                policyRefresh["reminderDate"] = this.__formatDate(this.state.reminderDate);
                policyRefresh.enumPolicyState = "YENILENMEDI";

                this.request = new AjaxRequest({
                    url: "policy/" + this.state.oldPolicyId,
                    type: "POST"
                });
                this.request.call(policyRefresh, undefined, function (response) {
                    if (response != null) {
                        Toast.success("Kayıt Başarılı");
                        this.__getAllPolicy();
                    } else {
                        Toast.error("Kayıt Başarısız")
                    }
                    this.setState({
                        policy: null,
                        displayDialogEdit: false,
                        oldPolicyId: null,
                        loading: false
                    });
                    this.forceUpdate();
                }.bind(this));
                break;
        }
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
        this.setState({policy: policy});
    }

    __calendarOnChangeDate(property, e) {
        let value = e.value;
        switch (property) {
            case "startDate":
                const days = 365;
                const DAY_IN_MS = 1000 * 60 * 60 * 24;
                const endDate = new Date(value.getTime() + (days * DAY_IN_MS));
                const reminderDate = new Date(endDate.getTime() - (7 * DAY_IN_MS));
                this.setState({startDate: value, endDate: endDate, reminderDate: reminderDate});
                break;
            case "endDate":
                this.setState({endDate: value});
                break;
            case "reminderDate":
                this.setState({reminderDate: value});
        }
    }

    __onSelectionChange(date) {
        this.setState({selectedPolicy: date, policyAddButtonDisable: false});
    }

    // row'un sonunda ki işlemler butonu
    __actionButton(rowData, column, type) {
        let selectedPolicy = column.rowData;
        switch (type) {
            case "detail":
                this.setState({
                    displayDialogDetail: true,
                    policy: selectedPolicy,
                    headerDialog: "Poliçe Bilgileri Detay",
                    type: type
                });
                break;
            case "edit":
                this.__getAllCompany();
                let startDate = new Date(selectedPolicy.startDate);
                let endDate = new Date(selectedPolicy.endDate);
                let reminderDate = new Date(selectedPolicy.reminderDate);
                this.setState({
                    displayDialogEdit: true,
                    policy: selectedPolicy,
                    headerDialog: "Poliçe Bilgileri Düzenle",
                    addModalButtonLabel: "Kaydet",
                    startDate: startDate,
                    endDate: endDate,
                    reminderDate: reminderDate,
                    type: type
                });
                break;
            case "refresh":
                this.__getAllCompany();
                const startDateQ = new Date(selectedPolicy.startDate);
                const endDateQ = new Date(selectedPolicy.endDate);
                const reminderDateQ = new Date(selectedPolicy.reminderDate);
                this.setState({
                    displayDialogEdit: true,
                    policy: selectedPolicy,
                    headerDialog: "Poliçe Yenile",
                    addModalButtonLabel: "Güncelle",
                    startDate: startDateQ,
                    endDate: endDateQ,
                    reminderDate: reminderDateQ,
                    oldPolicyId: selectedPolicy.id,
                    type: type
                });
                break;
            case "delete":
                this.setState({
                    displayDialogDetail: true,
                    policy: selectedPolicy,
                    headerDialog: "Poliçe Sil",
                    type: type
                });
                break
        }
        this.setState({loading: true});
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
                this.setState({companyList: response});
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
                //this.datasource = response;
                this.setState({
                    policyList: response,
                    loading: false
                });
            }
            this.forceUpdate();
        }.bind(this));
    }

    componentDidMount() {
        this.__getAllPolicy();
    }

}