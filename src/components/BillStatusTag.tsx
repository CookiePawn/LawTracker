import React from 'react';
import { StyleSheet } from 'react-native';
import { BillStatus } from '@/models';
import { colors } from '@/constants';
import { Typography } from '@/components';

interface BillStatusTagProps {
    status: string;
    style?: any;
    size?: 'small' | 'large';
}

const BillStatusTag: React.FC<BillStatusTagProps> = ({ status, style, size = 'small' }) => {
    return (
        <Typography style={[
            styles.tag,
            size === 'large' && {
                fontSize: 12,
                paddingHorizontal: 10,
                paddingVertical: 3,
                maxHeight: 30,
            },
            {
                backgroundColor:
                    status === BillStatus.MEETING ? colors.skyblue :
                    status === BillStatus.APPROVAL ? '#CAFFE0' :
                    status === BillStatus.PROCESSING ? '#FFDAB1' :
                    status === BillStatus.GOVERNMENT_TRANSFER ? '#E7BEFF' :
                    status === BillStatus.COMMITTEE_MEETING ? '#92A3F8' :
                    status === BillStatus.VOTE ? '#FFC8C8' :
                    status === BillStatus.COMMITTEE_REVIEW ? '#EEC979' :
                    status === BillStatus.PROMULGATION ? '#A1C3A9' :
                    status === BillStatus.INTRODUCTION ? '#FDF9D1' :
                    status === BillStatus.SUBMISSION ? '#FF7DFD' : '#DFDFDF'
            },
            {
                color:
                    status === BillStatus.MEETING ? '#519AFA' :
                    status === BillStatus.APPROVAL ? '#6CC58B' :
                    status === BillStatus.PROCESSING ? '#DE9440' :
                    status === BillStatus.GOVERNMENT_TRANSFER ? '#B04DEA' :
                    status === BillStatus.COMMITTEE_MEETING ? '#3756F0' :
                    status === BillStatus.VOTE ? '#DE3939' :
                    status === BillStatus.COMMITTEE_REVIEW ? '#BD8E29' :
                    status === BillStatus.PROMULGATION ? '#088B24' :
                    status === BillStatus.INTRODUCTION ? '#DCAE46' :
                    status === BillStatus.SUBMISSION ? '#CD16CA' : '#B1B1B1'
            },
            style
        ]}>
            {status}
        </Typography>
    );
};

const styles = StyleSheet.create({
    tag: {
        fontSize: 10,
        borderRadius: 100,
        paddingHorizontal: 7,
        paddingVertical: 3,
        maxHeight: 25,
    }
});

export default BillStatusTag; 