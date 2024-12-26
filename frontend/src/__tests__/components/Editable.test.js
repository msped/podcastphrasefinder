import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditableField from '@/pages/creator/_components/EditableField'; 
import '@testing-library/jest-dom'


const mockOnSave = jest.fn(); 

describe('EditableField Component', () => {
    const fieldName = 'testField';
    const urlParam = 'test-param';
    const initialValue = 'Initial Value';

    beforeEach(() => {
        mockOnSave.mockReturnValue({ status: null, isLoading: false, error: null }); 
    });

    it('should render in non-editing mode by default', () => {
        render(<EditableField onSave={mockOnSave} fieldName={fieldName}>{initialValue}</EditableField>);
        expect(screen.getByText(initialValue)).toBeVisible();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument(); 
    });

    it('should switch to editing mode when edit button is clicked', () => {
        render(<EditableField onSave={mockOnSave} fieldName={fieldName}>{initialValue}</EditableField>);
        const editButton = screen.getByLabelText('edit');
        fireEvent.click(editButton);

        expect(screen.getByDisplayValue(initialValue)).toBeVisible(); 
        expect(screen.getByLabelText('submit changes')).toBeVisible();
        expect(screen.getByLabelText('cancel changes')).toBeVisible();
    });

    it('should update the value when input field changes', () => {
        render(<EditableField onSave={mockOnSave} fieldName={fieldName}>{initialValue}</EditableField>);
        const editButton = screen.getByLabelText('edit');
        fireEvent.click(editButton);

        const inputField = screen.getByDisplayValue(initialValue);
        fireEvent.change(inputField, { target: { value: 'New Value' } });

        expect(inputField.value).toBe('New Value');
    });

    it('should call onSave with correct data on form submit', async () => {
        render(
            <EditableField onSave={mockOnSave} fieldName={fieldName} urlParam={urlParam}>
                {initialValue}
            </EditableField>
        );
        const editButton = screen.getByLabelText('edit');
        fireEvent.click(editButton);

        const inputField = screen.getByDisplayValue(initialValue);
        fireEvent.change(inputField, { target: { value: 'New Value' } });

        const form = screen.getByRole('form');
        fireEvent.submit(form);

        expect(mockOnSave).toHaveBeenCalledWith(urlParam, expect.any(FormData)); 
    });

    it('should revert to initial value and exit edit mode when cancel is clicked', () => {
        render(<EditableField onSave={mockOnSave} fieldName={fieldName}>{initialValue}</EditableField>);
        const editButton = screen.getByLabelText('edit');
        fireEvent.click(editButton);

        const inputField = screen.getByDisplayValue(initialValue);
        fireEvent.change(inputField, { target: { value: 'New Value' } });

        const cancelButton = screen.getByLabelText('cancel changes');
        fireEvent.click(cancelButton);

        expect(screen.queryByRole('textbox')).not.toBeInTheDocument(); 
        expect(screen.getByText(initialValue)).toBeVisible(); 
    });
});
