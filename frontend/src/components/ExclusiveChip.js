import React from 'react';
import {
    Chip,
    Tooltip
} from '@mui/material';

const styles = {
    exclusiveChip: {
        "&": {
            borderRadius: '5px'
        },
        fontWeight: '700',
        fontSize: '8pt',
        maxWidth: {
            sm: '20%',
        },
        marginLeft: '1.25%'
    }
}

export default function ExclusiveChip() {
    return (
        <Tooltip 
            title="This episode is a paid exclusive and may not be available on specific platforms." 
            placement="right"
        >
            <Chip label='EXCLUSIVE' sx={styles.exclusiveChip} size='small' />
        </Tooltip>
    )
}
