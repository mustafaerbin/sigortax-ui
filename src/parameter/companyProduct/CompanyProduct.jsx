import React, {Component} from "react";
import Card from "../../card/Card";
import CompanyProductModel from "./CompanyProductModel.json";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import ModalDataForm from "robe-react-ui/lib/form/ModalDataForm";
import DataGrid from "robe-react-ui/lib/datagrid/DataGrid";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import Assertions from "robe-react-commons/lib/utils/Assertions";
import RemoteEndPoint from "robe-react-commons/lib/endpoint/RemoteEndPoint";
import Store from "robe-react-commons/lib/stores/Store";
import FaIcon from "robe-react-ui/lib/faicon/FaIcon";

export default class CompanyProduct extends ShallowComponent {

    static idField = "id";
    companyRequest = new AjaxRequest({
        url: "company",
        type: "GET"
    });

    constructor(props) {
        super(props);

        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: "company-product"
            }),
            idField: CompanyProduct.idField,
            autoLoad: true
        });

        this.state = {
            fields: CompanyProductModel.fields,
            store: store,
            showModal: false,
            item: {},
            items: [],
            propsOfFields: {
                companyOid: {
                    items: []
                }
            }
        };
    }


    render() {
        return (
            <Card header="Şirket Ürün Yönetimi">
                <DataGrid
                    fields={this.state.fields}
                    store={this.state.store}
                    propsOfFields={this.state.propsOfFields}
                    ref={"table"}
                    toolbar={[{name: "create", text: "Ekle"}, {name: "edit", text: "Düzenle"}, {
                        name: "delete",
                        text: "Sil"
                    }]}
                    cellRenderer={this.__cellRenderer}
                    onNewClick={this.__add}
                    onEditClick={this.__edit}
                    onDeleteClick={this.__remove}
                    pagination={{emptyText: "No data.", pageSize: 20}}
                    modalConfirm={{header: "Please do not delete me."}}
                    pageSizeButtons={["20", "50", "100"]}
                    refreshable={true}
                    pageable={true}
                    editable={true}

                />
                <ModalDataForm
                    ref="detailModal"
                    header="Şirket Ürün Yönetimi"
                    show={this.state.showModal}
                    propsOfFields={this.state.propsOfFields}
                    fields={this.state.fields}
                    onSubmit={this.__onSave}
                    onCancel={this.__onCancel}
                    defaultValues={this.state.item}
                />
            </Card>
        );
    }

    __add() {
        let empty = {};
        this.__showModal(empty);
    }

    __edit() {
        let selectedRows = this.refs.table.getSelectedRows();
        if (!selectedRows || !selectedRows[0]) {
            return;
        }
        selectedRows[0].companyOid = this.__findCompanyObject(selectedRows[0].company.value).value;
        this.__showModal(selectedRows[0]);
    }

    __onCancel() {
        this.setState({showModal: false});
    }

    __onSave(newData, callback) {
        let id = newData[CompanyProduct.idField];
        newData.company = this.__findCompanyObject(newData.companyOid);
        if (Assertions.isNotEmpty(id)) {
            this.state.store.update(newData);
        } else {
            this.state.store.create(newData);
        }
        if (newData) {
            callback(true);
            this.setState({
                showModal: true
            });
        }
        // this.refs[DataGridSample.tableRef].__readData();
    }

    __remove() {
        let selectedRows = this.refs.table.getSelectedRows();
        this.state.store.delete(selectedRows[0]);
    }

    __findCompanyObject(selectedOid: String) {

        for (let i = 0; i < this.state.items.length; i++) {
            let companyObject = this.state.items[i];
            if (companyObject && companyObject.value == selectedOid)
                return companyObject;
        }
        return undefined;
    }

    __showModal(newItem: Object) {
        this.setState({showModal: true, item: newItem});
    }

    componentDidMount() {

        this.companyRequest.call(undefined, undefined, (response) => {
            let state = {};
            state.items = response;
            state.propsOfFields = this.state.propsOfFields;
            for (let i = 0; i < response.length; i++) {
                let res = response[i];
                state.propsOfFields.companyOid.items.push({
                    value: res.value,
                    text: res.label
                });
            }
            this.setState(state);
            this.forceUpdate();
        });
    }

    __cellRenderer(idx: number, fields: Array, row: Object) {
        if (fields[idx].name == 'label') {
            return <td key={fields[idx].name}>{row.label}</td>;
        }
        if (fields[idx].name == 'companyOid') {
            return <td key={fields[idx].name}>{row.company.label}</td>;
        }
        if (fields[idx].name == 'status') {
            if (row.status == true)
                return <td key={fields[idx].name}><FaIcon code={"fa-check-square-o "}/></td>;
            else
                return <td key={fields[idx].name}><FaIcon code={"fa-square-o "}/></td>;
        }

    }

}