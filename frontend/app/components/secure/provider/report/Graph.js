import React, { useEffect, useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ProviderDashboardService from '../../../../services/api/provider-dashboard.service';
import moment from 'moment';

const Graph = (props) => {

    console.log(props.data)
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                align: 'start',
                labels: {
                    boxWidth: 12,
                    boxHeight: 17,
                    padding: 12
                }
            },
        },
    };
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    return (
        <div className='p-3'>
            <div className='row'>
                {props.data && <Line options={options} data={props.data} />}
            </div>
        </div>
    )
}

export default Graph