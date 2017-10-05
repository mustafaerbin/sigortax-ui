import React, {Component} from "react";
import {Calendar} from 'primereact/components/calendar/Calendar';

export default class CalendarTR extends Component {


    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {

        let tr = {
            firstDayOfWeek: 1,
            dayNames: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
            dayNamesShort: ["p.tesi", "sa", "ça", "pe", "cu", "c.tesi", "pa"],
            dayNamesMin: ["P", "S", "Ç", "P", "C", "C", "P"],
            monthNames: ["Ocak", "Subat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
            monthNamesShort: ["oca", "şub", "mar", "nis", "may", "haz", "tem", "ağu", "eyl", "eki", "kas", "ara"]
        };

        return (
            <div>
                <Calendar
                    value={this.props.value}
                    locale={tr}
                    dateFormat="dd-MM-yy"
                    onChange={this.props.onChange}
                    monthNavigator="true"
                    yearNavigator="true"
                    yearRange="2015:2025"
                >
                </Calendar>
            </div>
        );
    }

}