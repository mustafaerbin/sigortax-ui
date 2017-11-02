import React, {Component} from "react";
import Card from "../../card/Card";
import {DataTable} from "primereact/components/datatable/DataTable";
import {Column} from "primereact/components/column/Column";
import {InputText} from "primereact/components/inputtext/InputText";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import {Modal} from "react-bootstrap";
import FaIcon from "robe-react-ui/lib/faicon/FaIcon";
import {Tooltip} from 'primereact/components/tooltip/Tooltip';
import {Button} from 'primereact/components/button/Button';

export default class OldPolicy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            filters: {}
        };
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
            </div>
        );
    }

    __detailButtonPolicy(rowData, column) {
        let selectedPolicy = column.rowData;
        this.setState({
            displayDialogDetail: true,
            policy: selectedPolicy,
            headerDialog: "Poliçe Bilgileri Detay"
        })
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

        return (
            <Card header="Geçmiş Poliçeler">
                <div>
                    <div className="content-section implementation">
                        <DataTable value={this.state.policyList}
                                   paginator={true} rows={10} header={header}
                                   globalFilter={this.state.globalFilter}
                                   filters={this.state.filters}
                                   selectionMode="single"
                                   selection={this.state.selectedPolicy}
                                   onSelectionChange={(e) => {
                                       this.setState({selectedCustomer: e.data});
                                   }}
                                   onFilter={this.onFilter}
                        >
                            <Column field="customer" header="İsim Soyisim" filter={true}/>
                            <Column field="company" header="Şirket" filter={true}/>
                            <Column field="companyProduct" header="Şirket Ürünü" filter={true}/>
                            <Column field="companySubProduct" header="Şirket Alt ürünü" filter={true}/>
                            <Column field="startDate" header="Başlangıç Tarihi" filter={true}/>
                            <Column field="endDate" header="Bitiş Tarihi" filter={true}/>
                            <Column field="agencyUserFullName" header="Kullanıcı" filter={true}/>
                            <Column header="İşlemler" body={this.__actionTemplate}
                                    style={{textAlign: 'center', width: '6em'}}>

                            </Column>
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
                                                {this.state.policy.customer}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="company">Şirket</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.company}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="companyProduct">Şirket Ürünü</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.companyProduct}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="companySubProduct">Şirket Alt Ürünü</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.policy.companySubProduct}
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
                                {dialogFooterDetail}
                            </Modal.Footer>

                        </Modal>
                    </div>
                </div>
                {this.__renderLoading()}
            </Card>
        );
    }

    __renderLoading() {
        if (this.state.loading) {
            return (
                <div className="text-center">
                    <FaIcon
                        code="fa-spinner fa-spin"
                        size="fa-5x"/>
                </div>);
        }
    }

    __getAllPolicy() {

        let request = new AjaxRequest({
            url: "policy-old",
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