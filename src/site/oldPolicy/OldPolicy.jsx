import React, {Component} from "react";
import Card from "../../card/Card";
import {DataTable} from "primereact/components/datatable/DataTable";
import {Column} from "primereact/components/column/Column";
import {InputText} from "primereact/components/inputtext/InputText";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import {Modal} from "react-bootstrap";
import FaIcon from "robe-react-ui/lib/faicon/FaIcon";

export default class OldPolicy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            filters: {}
        };
        this.onFilter = this.onFilter.bind(this);
        this.dateStartTemplate = this.dateStartTemplate.bind(this);
        this.dateEndTemplate = this.dateEndTemplate.bind(this);
    }

    onFilter(e) {
        this.setState({filters: e.filters});
    }

    render() {

        let header =
            <div style={{'textAlign': 'left'}}>
                <i className="fa fa-search" style={{margin: '4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})}
                           placeholder="Genel Arama" size="50"/>
            </div>;

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
                            // onSelectionChange={(e) => {
                            //     this.setState({selectedCustomer: e.data, policyAddButtonDisable: false});
                            // }}
                                   onFilter={this.onFilter}
                        >
                            <Column field="customer" header="İsim Soyisim" filter={true}/>
                            <Column field="company" header="Şirket" filter={true}/>
                            <Column field="companySubProduct" header="Şirket ürünü" filter={true}/>
                            <Column field="startDate" header="Başlangıç Tarihi" filter={true}
                                    body={this.dateStartTemplate}/>
                            <Column field="endDate" header="Bitiş Tarihi" filter={true}
                                    body={this.dateEndTemplate}/>
                            <Column field="agencyUserFullName" header="Kullanıcı" filter={true}/>
                        </DataTable>
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

    dateStartTemplate(rowData, column) {
        return this.__formatDate(new Date(rowData.startDate));
    }

    dateEndTemplate(rowData, column) {
        return this.__formatDate(new Date(rowData.endDate));
    }

    __formatDate(d) {
        let month = String(d.getMonth() + 1);
        let day = String(d.getDate());
        const year = String(d.getFullYear());

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return `${year}-${month}-${day}`;
    }

    componentDidMount() {
        this.__getAllPolicy();
    }

}