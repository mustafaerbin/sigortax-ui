import React, {Component} from "react";
import {DataTableTR} from "primereact/components/datatable/DataTable";

export default class DataTable extends Component {


    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        return (
            <div>
                <DataTableTR value={this.props.value}
                           paginator={true}
                           rows={15}
                           rowsPerPageOptions={[15, 30, 45]}
                           header={this.props.header}
                           globalFilter={this.props.globalFilter}
                           filters={this.props.filters}
                           onFilter={this.props.onFilter}
                           selection={this.props.selection}

                    // totalRecords={this.state.totalRecords}
                    // lazy={true}
                    // onLazyLoad={this.onLazyLoad}
                    // onSelectionChange={(e) => {
                    //     this.setState({selectedCustomer: e.data, policyAddButtonDisable: false});
                    // }}
                           onSelectionChange={this.props.onSelectionChange}
                >
                </DataTableTR>
            </div>
        );
    }

}