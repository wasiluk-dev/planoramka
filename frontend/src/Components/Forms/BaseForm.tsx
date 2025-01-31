import React from 'react';
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, TextField } from '@mui/material';

import {
    BuildingPopulated,
    ClassTypePopulated,
    CoursePopulated,
    RoomPopulated,
    SemesterPopulated,
    SubjectPopulated,
} from '../../../services/DBTypes.ts';

export type BaseFormProps = {
    fields: {
        label: React.ReactNode;
        helperText?: string;
        value?: string;
        setter?: React.Dispatch<React.SetStateAction<string>>;
        type?: React.HTMLInputTypeAttribute;
        required?: boolean;
        select?: {
            value: number | string[];
            setter: React.Dispatch<React.SetStateAction<string[]>>;
            items?: BuildingPopulated[] | ClassTypePopulated[] | CoursePopulated[] | RoomPopulated[] | SemesterPopulated[] | SubjectPopulated[];
            multiple?: boolean;
            enumData?: {
                keys: string[];
                values: { [key: number]: string; };
            };
        };
    }[];
}

const BaseForm: React.FC<BaseFormProps> = ({ fields }) => {
    return (<>
        { fields.map((field, i) =>
            <FormControl key={ i } sx={{ mt: 1, mb: field.helperText ? 0.5 : 1 }}>
                { field.select ? (<>
                    <InputLabel>{ `${ field.label }${ field.select && field.required ? ' *' : '' }` }</InputLabel>
                    <Select
                        label={ `${ field.label }${ field.select && field.required ? ' *' : '' }` }
                        value={ field.select.value }
                        multiple={ field.select.multiple }
                        onChange={ (event: any) => field.select?.setter(event.target.value) }
                        renderValue={ selected => {
                            if (field.select?.enumData && typeof selected === 'number') {
                                return field.select.enumData.values[selected];
                            }

                            if (field.select?.items && Array.isArray(selected)) {
                                return field.select?.items
                                    .filter(item =>
                                        selected.includes(item._id)
                                    )
                                    .map(item => {
                                        if ('roomNumber' in item) {
                                            return item.roomNumber;
                                        } else if ('index' in item) {
                                            return item.index;
                                        } else if ('code' in item) {
                                            if (field.select?.multiple) {
                                                return item.code;
                                            } else {
                                                return `[${item.code}] ${item.name}`;
                                            }
                                        } else if ('name' in item) {
                                            return item.name;
                                        }
                                    })
                                    .join(', ');
                            }
                        } }
                    >
                        { field.select.items && field.select.items
                            .sort((a, b) => {
                                if (typeof a !== 'object' || typeof b !== 'object') return 0;

                                if ('roomNumber' in a && 'roomNumber' in b) {
                                    return a.roomNumber.localeCompare(b.roomNumber);
                                } else if ('index' in a && 'index' in b) {
                                    return a.index - b.index;
                                } else if ('name' in a && 'name' in b) {
                                    return a.name.localeCompare(b.name);
                                } else {
                                    return a._id.localeCompare(b._id);
                                }
                            })
                            .map(item =>
                                <MenuItem key={ item._id } value={ item._id }>
                                    { field.select?.multiple && Array.isArray(field.select?.value) && (
                                        <Checkbox checked={ field.select?.value?.includes(item._id) }/>
                                    ) }
                                    <ListItemText
                                        primary={ <>
                                            { 'number' in item && (
                                                item.number
                                            ) }
                                            { 'index' in item && (
                                                `Semestr ${ item.index }`
                                            ) }
                                            { 'name' in item && (
                                                item.name
                                            ) }
                                        </> }
                                        secondary={ <>
                                            { 'numberSecondary' in item && (
                                                item.numberSecondary
                                            ) }
                                            { 'code' in item && (
                                                item.code
                                            ) }
                                        </> }
                                    />
                                </MenuItem>
                            )
                        }

                        { field.select.enumData && Object.values(field.select.enumData.values).map((v, i) =>
                            <MenuItem key={ i } value={ i }>{ v }</MenuItem>
                        ) }
                    </Select>
                </>) : (
                    <TextField
                        label={ field.label }
                        required={ field.required }
                        type={ field.type }
                        helperText={ field.helperText }
                        onChange={ event => {
                            if (field.setter) field.setter(event.target.value);
                        } }
                    />
                ) }
            </FormControl>
        ) }
    </>);
};

export default BaseForm;
