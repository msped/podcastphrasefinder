import React from 'react';
import DashboardLayout from './DashboardLayout'

const withDashboardLayout = (Component) => {
    return function WithDashboardLayout(props) {
        return (
            <DashboardLayout>
                <Component {...props} />
            </DashboardLayout>
        );
    };
};

export default withDashboardLayout;
