import React, { useState, useEffect } from 'react';
import { TextField, IconButton, Typography, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import LoadingSpinner from '@/components/LoadingSpinner';

import toast from 'react-hot-toast';


export default function EditableField({
    children, onSave, fieldName, urlParam, ...typographyProps
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(children || '');
    const [formDataState, setFormDataState] = useState(null)
    const { status, isLoading, error } = onSave(urlParam, formDataState);

    useEffect(() => {
        if (status >= 200 && status < 300) {
            toast.success('Succesfully updated!');
            setIsEditing(false);
        } else if (error) {
            for (const [key, value] of Object.entries(error.response.data)) {
                toast.error(`${key} - ${value}`)
            }
            setIsEditing(true)
        }
    }, [status, isLoading, error])

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleOnSubmit = async (event) => { 
        event.preventDefault();
        const formData = new FormData(event.target);
        setFormDataState(formData);
    };

    const handleCancelClick = () => {
        setValue(children); 
        setIsEditing(false);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        {isEditing ? (
            <form onSubmit={handleOnSubmit} aria-label='edit field'> 
                <TextField value={value} size='small' name={fieldName} onChange={handleChange} />
                {isLoading ? (
                    <LoadingSpinner />
                ): (
                    <>
                        <IconButton type='submit' aria-label='submit changes' size='small' color="primary">
                            <DoneIcon />
                        </IconButton>
                        <IconButton aria-label='cancel changes' onClick={handleCancelClick} size='small' color="secondary">
                            <ClearIcon />
                        </IconButton>
                    </>
                )}
            </form>
        ) : (
            <Stack direction='row' spacing={1} justifyContent='center' alignItems='center'>
                <Typography {...typographyProps}>
                    {value} 
                </Typography>
                <IconButton aria-label='edit' size='small' onClick={handleEditClick}>
                    <EditIcon fontSize='8pt' />
                </IconButton>
            </Stack>
        )}
        </div>
    );
}
