import { DefaultLayout } from '~/layouts';
import {
    AdmissionManagerLoginPage, AdmissionListPage,
    AdmissionAcceptedListPage, ApplyForAdmissionPage,
    HomePage,
}
    from '~/pages';

import { FormLookupAdmissionProfile } from '~/components';
export const public_routers = [
    {
        path: '/',
        element: <HomePage />,
        layout: null
    },
    {
        path: '/nophosoxettuyen',
        element: <ApplyForAdmissionPage />,
        layout: null
    }, {
        path: '/tracuuhoso',
        element: <FormLookupAdmissionProfile />,
        layout: null
    }
]

export const private_routers = [
    {
        path: '/canbots-login',
        element: <AdmissionManagerLoginPage />,
        layout: null
    },
    {
        path: '/hosoxettuyen',
        element: <AdmissionListPage />,
        layout: DefaultLayout
    }, {
        path: '/hosotrungtuyen',
        element: <AdmissionAcceptedListPage />,
        layout: DefaultLayout
    }
]