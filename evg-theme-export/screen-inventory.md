# Screen Inventory

Source: `src/App.js` (router), `src/general/constants/AppRoute.js` (path constants), `src/general/components/Sidebars/MenuItemsList.js` (sidebar menu data).

Total top-level `<Route>` elements in `src/App.js`: **~50** (100 `<Route` occurrences counting nested feature sub-routers). Layout: every authenticated CMS screen renders inside `KT01BaseLayout` (`general/components/BaseLayout/KT01BaseLayout/index.js`); pre-auth screens render inside `AuthBaseScreen` instead (see below). Route guards: `PrivateRoute`, `GuestRoute`, `GuestPaymentRoute`, `CustomerRoute` (`src/general/components/AppRoutes/`).

## Authenticated CMS screens (sample across modules — representative, not exhaustive; ~50 route entries total)

| Path key | `App.js` line | Screen component | Layout |
|---|---|---|---|
| `/` | 149 | `DashboardRoute` | `KT01BaseLayout` |
| `dashboard/*` | 224 | `ChargeDashboard` | `KT01BaseLayout` |
| `agencyDashboard/*` | 234 | `AgencyDashboard` | `KT01BaseLayout` |
| `stationList/*` | 242 | `ChargeStation` | `KT01BaseLayout` |
| `pointList/*` | 250 | `ChargePoint` | `KT01BaseLayout` |
| `stationsMap/*` | 259 | `ChargeStationMapScreen` | `KT01BaseLayout` |
| `energyBillList/*` | 273 | `EnergyBill` | `KT01BaseLayout` |
| `premisesList/*` | 283 | `ManagePremises` | `KT01BaseLayout` |
| `chargeTransactionList/*` | 293 | `ChargeTransaction` | `KT01BaseLayout` |
| `pushNotificationList/*` | 303 | `PushNotification` | `KT01BaseLayout` |
| `systemLogList/*` | 312 | `ChargeSystemLog` | `KT01BaseLayout` |
| `productCategoryList/*` | 321 | `ProductCategory` | `KT01BaseLayout` |
| `inventoryList/*` | 330 | `ChargeInventory` | `KT01BaseLayout` |
| `valuationList/*` | 339 | `ChargePricing` | `KT01BaseLayout` |
| `staffList/*` | 348 | `Staff` | `KT01BaseLayout` |
| `tutorialList/*` | 357 | `Tutorial` | `KT01BaseLayout` |
| `generalSetting/*` | 366 | `GeneralSetting` | `KT01BaseLayout` |
| `manageBanner/*` | 375 | `Banner` | `KT01BaseLayout` |
| `paymentGatewayConfig/*` | 384 | `PaymentGatewayConfigScreen` | `KT01BaseLayout` |
| `actionLogList/*` | 393 | `ActionLog` | `KT01BaseLayout` |
| `staffPermissionList/*` etc. (5 role variants) | 403-460 | `PermissionGroup` | `KT01BaseLayout` |
| `managePaymentTransactions/*` | 472 | `ManagePaymentTransactions` | `KT01BaseLayout` |
| `customerTopUpHistory/*` | 482 | `ChargeDriverTopUpHistoryScreen` | `KT01BaseLayout` |
| `commissionTransactionList/*` | 492 | `ManageCommissionTransaction` | `KT01BaseLayout` |
| `withdrawTransactionList/*` | 502 | `ManageAgencyTransaction` | `KT01BaseLayout` |
| `saleList/*`, `saleInfo/*`, `saleHistory/*` | 512-555 | `ManageDealer` | `KT01BaseLayout` |
| `subSaleList/*` | 530 | `ManageSubAgencies` (role="SALE") | `KT01BaseLayout` |
| `transactionHistory/*` | 539 | `ManageTransactionHistory` | `KT01BaseLayout` |
| `agencySaleAddOrder(/…)` | 557, 849-864 | `AgencySaleAddOrderScreen` | `KT01BaseLayout` |
| `marketingDocs` | 566 | `MarketingDocsScreen` | `KT01BaseLayout` |
| `orderList/*` etc. | 584-618 | `ManageOrder` | `KT01BaseLayout` |
| `customerList/*` | 620 | `ChargeDriver` | `KT01BaseLayout` |
| `manageInvestor/*`, `investorList/*`, `investorInfo/*` | 630-727 | `ManageInvestor` | `KT01BaseLayout` |
| `groupList/*`, `groupInfo/*` | 648-682 | `ManageGroup` | `KT01BaseLayout` |
| `subGroupList/*` | 685 | `ManageSubAgencies` (role="GROUP") | `KT01BaseLayout` |
| `investorsReport/*`, `groupsReport/*`, `groupReport/*` | 693-718 | `*ReconciliationReport` | `KT01BaseLayout` |
| `investmentPackList/*` | 729 | `InvestorGroupPackListScreen` | `KT01BaseLayout` |
| `groupPackHistory/*` | 738 | `InvestorGroupPackHistory` | `KT01BaseLayout` |
| `landlordList/*`, `landlordInfo/*` | 748-764 | `ManageLandowner` | `KT01BaseLayout` |
| `electricityPayment/*` | 766 | `ElectricityPaymentHistory` | `KT01BaseLayout` |
| `landlordsReport/*`, `landlordReport/*` | 775-791 | `*ReconciliationReport` | `KT01BaseLayout` |
| `chargePointPartnerList/*` | 794 | `ManageChargePointPartner` | `KT01BaseLayout` |
| `manageVehicleBrand/*` | 803 | `VehicleBrand` | `KT01BaseLayout` |
| `vehicleList/*` | 812 | `ChargeVehicle` | `KT01BaseLayout` |
| `rfidList/*` | 821 | `ChargeRfid` | `KT01BaseLayout` |
| `manageChargeBrand/*` | 830 | `ChargeBrand` | `KT01BaseLayout` |
| `superDashboard/*` | 839 | `ChargeSOC` | `KT01BaseLayout` |
| `agencySaleOrderList/*`, `agencySaleOrderDetail/:saleId` | 867-882 | `AgencySaleOrderListScreen` / `AgencySaleDetailScreen` | `KT01BaseLayout` |
| `agencyContractList/*`, `contractList/*` | 903-959 | `AgencyContractListScreen` | `KT01BaseLayout` |
| `agencyConfigCommission/*` | 923 | `AgencyConfigCommissionScreen` | `KT01BaseLayout` |
| `affiliateTree/*` | 933 | `AffiliateTree` | `KT01BaseLayout` |
| `poaContract` | 962 | `PoaContractListScreen` | `KT01BaseLayout` |
| `withdrawTransaction/*` | 971 | `AgencyWithdrawScreen` | `KT01BaseLayout` |
| `reconciliationReport/*` | 981 | `ReconciliationReport` | `KT01BaseLayout` |
| `*` (catch-all 404) | 1001 | `KTPageError01` | none |

## Not-CMS-shell routes (customer-facing / no-guard / guest payment)

| Path | Line | Component | Notes |
|---|---|---|---|
| `/customer-home/*` | 158 | redirect | customer-facing, not CMS |
| `customerProductDetail` | 163 | `CustomerProductDetailScreen` | `CustomerRoute` guard |
| `customer/:customerTab/*` | 181 | `CustomerHomeScreen` | `CustomerRoute` guard |
| `/prepaid/qr/:chargeConnectorSerial` | 207 | `ChargePointDetailScreen` | no guard — public QR flow |
| `/prepaid/qr/payment` | 208 | `ChargePaymentQRScreen` | `GuestPaymentRoute` |
| `/prepaid/qr/transaction/:id` | 216 | `ChargeTransactionDetailScreen` | `GuestPaymentRoute` |
| `stationsMapIframe/*` | 267 | `ChargeStationIframeMapScreen` | no guard — embeddable iframe |
| `/topup/:serialNumber(/payment)` | 990-997 | `ChargeDriverTopupDetailScreen`, `ChargePaymentQRScreen` | public top-up flow |
| `/payment/vnpay/completed` | 999 | `DialogTopupCompletedScreen` | payment callback |

These are **out of scope** for the AppShell/Sidebar/Header token work — they don't render `KT01BaseLayout` — but are listed for completeness since they still consume shared UI components (buttons, forms, alerts).

## Auth screens

Router: `src/App.js:190` → `auth/*` (`GuestRoute`) → `src/features/Auth/index.js:8` → `AuthBaseScreen`.

Layout: `src/features/Auth/screens/AuthBaseScreen/index.js` — own shell (`.login.login-1` + `login-aside` background image, lines 159-273). **Not** wrapped by `KT01BaseLayout`.

| Sub-path | Line (in `AuthBaseScreen`) | Component |
|---|---|---|
| `sign-in` | 197 | `src/features/Auth/components/SignInForm/index.js` |
| `sign-up` | 229 | `SignUpForm` (default role) |
| `sign-up-sale` | 207 | `SignUpForm` (role="SALE") |
| `sign-up-sale-only` | 217 | `SignUpForm` (role="SALE_ONLY") |
| `sign-up-investor` | 237 | `SignUpForm` (role="INVESTOR") |
| `sign-up-group` | 247 | `SignUpForm` (role="GROUP") |
| `forgot-password` | 257 | `src/features/Auth/components/ForgotPasswordForm/index.js` |
| `reset-password` | 266 | `src/features/Auth/components/ResetPasswordForm/index.js` |

## Sidebar menu (data source: `MenuItemsList.js`, `getMenuItemsList(user, poaUserId, agencyRoleList)`)

Role-keyed object: `admin` (lines 9-439), `operator` (440-1495, includes sale/group/investor/landlord sub-blocks), `default: []` (1496). Role resolved via `RoleUtils.isAdminUiRole` / `RoleUtils.getPrimaryAgencyRole` (lines 1499-1513). Each entry shape: `{ type: 'section'|'item', text, icon?, path, breadcrumPath?, show?, subMenuItems? }`, rendered up to 4 levels deep by `KT01Sidebar/index.js` (154-368), filtered by `SidebarHelper.checkPermissionList`.

Top-level `admin` sections (sample — file has ~100+ item objects across all role keys, not fully enumerated):

| Line | Type | Label | Icon (FA class) | Path |
|---|---|---|---|---|
| 11 | section | Quản lý thông tin chung | — | manageGeneralInfo |
| 16 | item | Dashboard | `fa-solid fa-grid-2` | dashboard |
| 23 | section | Quản lý trạm sạc | — | manageChargeStations |
| 28 | item | Quản lý trạm sạc (+4 sub) | `fas fa-charging-station` | manageChargeStations |
| 78 | item | Trang thiết bị & dịch vụ (+2 sub) | `fa-solid fa-microchip` | inventoryList |
| 98 | item | Quản lý định giá | `fa-solid fa-money-check-dollar-pen` | valuationList |
| 106 | item | Quản lý phương tiện (+3 sub) | `fas fa-car-side-bolt` | manageVehicles |
| 130 | section | Quản lý giao dịch sạc | — | chargeTransactionList |
| 144 | section | Quản lý khách hàng | — | customerList |
| 150 | item | Danh sách khách hàng | `fa-solid fa-users` | customerList |
| 166 | section | Quản lý đại lý | — | manageDealership |
| 172 | item | Danh sách đại lý | `fa-solid fa-briefcase` | saleList |
| 196 | section | Quản lý NĐT và chủ mặt bằng | — | managePartners |
| ~1480 | item | Quản lý nhân viên / nhóm quyền | `fa-solid fa-user-vneck` | manageStaffs |

Additional role-specific blocks (`operator`, sale/group/investor/landlord sub-agency variants) exist further in the same file — sampled rather than fully enumerated per the brief's scope guidance; the pattern (section → item → up to 3 nested subMenuItems, icon = FA class string, path = `AppRoute` key) is uniform across all role blocks, so Theme Lab's sidebar demo (see `theme-lab/`) reproduces this pattern with representative fake data rather than the full 1516-line dataset.

## No dev-only/Storybook/Playground page exists in source

`rg -n "storybook|Playground|ThemeLab|DevOnly" src -i` → zero matches. No `.storybook/` config. This confirms Theme Lab must be introduced as a new, separate static artifact (see `theme-lab/`) rather than gated behind an existing dev-only mechanism — none exists to hook into.
