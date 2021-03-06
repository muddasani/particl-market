// Copyright (c) 2017-2020, The Particl Market developers
// Distributed under the GPL software license, see the accompanying
// file COPYING or https://github.com/particl/particl-market/blob/develop/LICENSE

import { ShippingAvailability } from '../../api/enums/ShippingAvailability';

declare module 'resources' {

    interface ShippingDestination {
        id: number;
        country: string;
        shippingAvailability: ShippingAvailability;
        createdAt: Date;
        updatedAt: Date;
    }

}
