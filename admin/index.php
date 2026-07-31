<!DOCTYPE html>
<html>

<head>
    <title>Shyam111</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="_token" content="">

    <link rel="shortcut icon" href="favicon.ico">

    <!-- plugin css -->
    <link href="assets/fonts/feather-font/css/iconfont.css" rel="stylesheet" />
    <link href="assets/plugins/flag-icon-css/css/flag-icon.min.css" rel="stylesheet" />
    <link href="assets/plugins/perfect-scrollbar/perfect-scrollbar.css" rel="stylesheet" />
    <link href="assets/plugins/@mdi/css/materialdesignicons.min.css" rel="stylesheet" />
    <!-- end plugin css -->

    <link href="assets/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css" rel="stylesheet" />

    <!-- common css -->
    <link href="css/app.css" rel="stylesheet" />
    <!-- end common css -->

</head>

<body data-base-url="http://13.232.54.110" class="sidebar-dark loaded">

    <script src="assets/js/spinner.js"></script>

    <div class="main-wrapper" id="app">
       
    

<nav class="sidebar">
    <div class="sidebar-header">
        <a href="" class="sidebar-brand"><span style="color: #01e8ff; font-size: 21px;">Shyam111</span>
            <!--<a href="" class="sidebar-brand"><span style="color: #01e8ff;">MASTER</span>-->
        </a>
        <div class="sidebar-toggler not-active">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
    <div class="sidebar-body">
        <ul class="nav">





            <li class="nav-item nav-category">Main</li>
            <li class="nav-item ">
                <a href="dashboard.php" class="nav-link">
                    <i class="link-icon" data-feather="box"></i>
                    <span class="link-title">Dashboard</span>
                </a>
            </li>










            <li class="nav-item nav-category">Management</li>

            <li class="nav-item ">
                <a class="nav-link" href="SuperDistributer.php">
                    <i class="link-icon" data-feather="users"></i>
                    <span class="link-title">SuperDistributer</span>
                </a>
            </li>
            <li class="nav-item ">
                <a class="nav-link" href="Distributer.php">
                    <i class="link-icon" data-feather="users"></i>
                    <span class="link-title">Distributer</span>
                </a>
            </li>
            <li class="nav-item ">
                <a class="nav-link" href="Retailer.php">
                    <i class="link-icon" data-feather="users"></i>
                    <span class="link-title">Retailer</span>
                </a>
            </li>
            <li class="nav-item ">
                <a class="nav-link" href="Users.php">
                    <i class="link-icon" data-feather="users"></i>
                    <span class="link-title">Users</span>
                </a>
            </li>


            <li class="nav-item ">
                <a href="onlinePlayer.php" class="nav-link">
                    <i class="link-icon" data-feather="log-in"></i>
                    <span class="link-title">Online Players</span>
                </a>
            </li>
            <li class="nav-item nav-category">Game</li>
            <li class="nav-item ">
                <a href="Users_Game_Details.php" class="nav-link">
                    <i class="link-icon" data-feather="inbox"></i>
                    <span class="link-title">Game History</span>
                </a>
            </li>

            <li class="nav-item ">
                <a href="WinPercentage.php" class="nav-link">
                    <i class="link-icon" data-feather="inbox"></i>
                    <span class="link-title">Win Percentage</span>
                </a>
            </li>

            <li class="nav-item ">
                <a href="CalculatorNote.php" class="nav-link">
                    <i class="link-icon" data-feather="inbox"></i>
                    <span class="link-title">Calculator Note</span>
                </a>
            </li>










            <li class="nav-item nav-category">Turn-Over Reports</li>

            <li class="nav-item ">
                <a href="Super_Admin_trun_over.php" class="nav-link">
                    <i class="link-icon" data-feather="inbox"></i>
                    <span class="link-title">Admin</span>
                </a>
            </li>
            <li class="nav-item ">
                <a href="SuperDistributer_trun_over.php" class="nav-link">
                    <i class="link-icon" data-feather="inbox"></i>
                    <span class="link-title">SuperDistributer</span>
                </a>
            </li>
            <li class="nav-item ">
                <a href="Distributer_trun_over.php" class="nav-link">
                    <i class="link-icon" data-feather="inbox"></i>
                    <span class="link-title">Distributer</span>
                </a>
            </li>
            <li class="nav-item ">
                <a href="Retailer_trun_over.php" class="nav-link">
                    <i class="link-icon" data-feather="inbox"></i>
                    <span class="link-title">Retailer</span>
                </a>
            </li>
            <li class="nav-item ">
                <a href="User_trun_over.php" class="nav-link">
                    <i class="link-icon" data-feather="inbox"></i>
                    <span class="link-title">User</span>
                </a>
            </li>









            <li class="nav-item nav-category">Commission</li>

            <!--<li class="nav-item ">-->
            <!-- <a href="transaction.php" class="nav-link">-->
            <!-- <i class="link-icon" data-feather="briefcase"></i>-->
            <!-- <span class="link-title">Transaction Report</span>-->
            <!-- </a>-->
            <!--</li>-->

            <li class="nav-item ">
                <a href="commission.php" class="nav-link">
                    <i class="link-icon" data-feather="briefcase"></i>
                    <span class="link-title">User Wise</span>
                </a>
            </li>
            <li class="nav-item ">
                <a href="game_wise_commission_report.php" class="nav-link">
                    <i class="link-icon" data-feather="briefcase"></i>
                    <span class="link-title">Game Wise</span>
                </a>
            </li>















            <!-- change :- [ deposit ==> deposit1 ] -->
            <li class="nav-item ">
                <a class="nav-link" data-toggle="collapse" href="#deposit1" role="button" aria-expanded="false"
                    aria-controls="deposit1">
                    <i class="link-icon" data-feather="download"></i>
                    <span class="link-title">Live Result</span>
                    <i class="link-arrow" data-feather="chevron-down"></i>
                </a>

                <div class="collapse " id="deposit1">
                    <ul class="nav sub-menu">


                        <li class="nav-item">
                            <a href="Game_LiveResults_Dus_2D_Lottery.php" class="nav-link ">2D Lottery</a>
                        </li>

                        <li class="nav-item">
                            <a href="Game_LiveResults_Dus_3D_Lottery.php" class="nav-link ">3D Lottery</a>
                        </li>

                        <li class="nav-item">
                            <a href="Game_LiveResults_Lucky12.php" class="nav-link ">Lucky 12</a>
                        </li>

                        <li class="nav-item" style="display:none;">
                            <a href="Game_LiveResults_TweleveCard.php" class="nav-link ">12 Card</a>
                        </li>

                    </ul>

                </div>
            </li>


















            <li class="nav-item nav-category">Others Activity</li>

            <li class="nav-item ">
                <a class="nav-link" data-toggle="collapse" href="#deposit11" role="button" aria-expanded="false"
                    aria-controls="deposit11">
                    <i class="link-icon" data-feather="download"></i>
                    <span class="link-title">Others Activity</span>
                    <i class="link-arrow" data-feather="chevron-down"></i>
                </a>

                <div class="collapse " id="deposit11">
                    <ul class="nav sub-menu">


                        <li class="nav-item">
                            <a href="Transaction_history.php" class="nav-link ">Transaction History</a>
                        </li>
                        <li class="nav-item">
                            <a href="logActivities.php" class="nav-link ">Logs</a>
                        </li>
                        <li class="nav-item">
                            <a href="DeleteRecords.php" class="nav-link ">Delete Data</a>
                        </li>
                        <li class="nav-item">
                            <a href="UserCancleTickets.php" class="nav-link ">Cancle Tickets</a>
                        </li>



                    </ul>

                </div>
            </li>

























            <li class="nav-item nav-category">Winning decleare</li>


            <!-- Winning decleare -->
            <li class="nav-item ">
                <a class="nav-link" data-toggle="collapse" href="#deposit111" role="button" aria-expanded="false"
                    aria-controls="deposit111">
                    <i class="link-icon" data-feather="download"></i>
                    <span class="link-title">Winning decleare</span>
                    <i class="link-arrow" data-feather="chevron-down"></i>
                </a>

                <div class="collapse " id="deposit111">
                    <ul class="nav sub-menu">

                        <li class="nav-item">
                            <a href="WinningResultDeclare_4D.php" class="nav-link ">2D Lottery</a>
                        </li>


                        <li class="nav-item">
                            <a href="WinningResultDeclare_3D.php" class="nav-link ">3D Lottery</a>
                        </li>

                        <li class="nav-item">
                            <a href="WinningResultDeclare_Lucky12.php" class="nav-link ">Lucky 12</a>
                        </li>

                    </ul>

                </div>
            </li>




        </ul>
    </div>
</nav>    

        <div class="page-wrapper">

            
<nav class="navbar dark">
    <a href="#" class="sidebar-toggler">
        <i data-feather="menu"></i>
    </a>
    <div class="navbar-content">
        <ul class="navbar-nav">
            <li class="nav-item dropdown nav-profile">
                <a class="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                    <img src="applogo.png" alt="profile" />
                </a>
                <div class="dropdown-menu" aria-labelledby="profileDropdown">
                    <div class="dropdown-header d-flex flex-column align-items-center" style="background-color: #00dcff99;">
                        <div class="figure mb-3">
                            <img src="applogo.png" alt="" />
                        </div>
                        <div class="info text-center">
                            <p class="name font-weight-bold mb-0">superadmin</p>
                            <p class="email text-muted mb-3">admin@gmail.com</p>
                        </div>
                    </div>
                    <div class="dropdown-body">
                        <ul class="profile-nav p-0 pt-3">
                            
                            <li class="nav-item">
                                <a href="profile.php" class="nav-link">
                                    <i data-feather="edit"></i>
                                    <span>Edit Profile</span>
                                </a>
                            </li>
                            
                            <li class="nav-item">
                                <a href="./session_destroy.php" class="nav-link">
                                    <i data-feather="log-out"></i>
                                    <span>Log Out</span>
                                </a>
                                <form id="frm-logout" action="logout" method="POST" style="display: none">
                                    <input type="hidden" name="_token"
                                        value="YSgMhxcTwDkTktHlDonU3bhbsdde42lvR5fkjxpZ" />
                                </form>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</nav>
            <div class="page-content">
                <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
                    <div>
                        <h4 class="mb-3 mb-md-0">Welcome to Dashboard</h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-xl-12 stretch-card">
                        <div class="row flex-grow">
                            
                            <div class="col-lg-3 col-md-3 col-sm-3 grid-margin stretch-card">
                                <div class="card card-outline-primary">
                                    <a href="SuperDistributer.php">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-8">
                                                    <h6 class="card-title mb-1">SuperDistributer</h6>
                                                    <h3 class="mb-1">2</h3>
                                                </div>
                                                <div class="col-md-4 mt-1">
                                                    <h1 class="text-right mr-3"><i data-feather="user-plus"></i></h2>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            
                            <div class="col-lg-3 col-md-3 col-sm-3 grid-margin stretch-card">
                                <div class="card card-outline-primary">
                                    <a href="Distributer.php">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-8">
                                                    <h6 class="card-title mb-1">Distributer</h6>
                                                    <h3 class="mb-1">7</h3>
                                                </div>
                                                <div class="col-md-4 mt-1">
                                                    <h1 class="text-right mr-3"><i data-feather="user-plus"></i></h2>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            
                            <div class="col-lg-3 col-md-3 col-sm-3 grid-margin stretch-card">
                                <div class="card card-outline-primary">
                                    <a href="Retailer.php">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-8">
                                                    <h6 class="card-title mb-1">Retailer</h6>
                                                    <h3 class="mb-1">14</h3>
                                                </div>
                                                <div class="col-md-4 mt-1">
                                                    <h1 class="text-right mr-3"><i data-feather="user-plus"></i></h2>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            
                            <div class="col-lg-3 col-md-3 col-sm-3 grid-margin stretch-card">
                                <div class="card card-outline-primary">
                                    <a href="Users.php">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-8">
                                                    <h6 class="card-title mb-1">Users</h6>
                                                    <h3 class="mb-1">142</h3>
                                                </div>
                                                <div class="col-md-4 mt-1">
                                                    <h1 class="text-right mr-3"><i data-feather="user-plus"></i></h2>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            
                            <div class="col-lg-3 col-md-3 col-sm-3 grid-margin stretch-card">
                                <div class="card card-outline-primary">
                                    <a href="Users_Game_Details.php">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-8">
                                                    <h6 class="card-title mb-1">Today Game Bet</h6>
                                                    <h3 class="mb-1">129332</h3>
                                                </div>
                                                <div class="col-md-4 mt-1">
                                                    <h1 class="text-right mr-3"><i data-feather="inbox"></i></h2>
                                                </div>
                                            </div>

                                        </div>
                                    </a>
                                </div>
                            </div>
                            
                            <div class="col-lg-3 col-md-3 col-sm-3 grid-margin stretch-card">
                                <div class="card card-outline-primary">
                                    <a href="onlinePlayer.php">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-8">
                                                    <h6 class="card-title mb-1">Online Player</h6>
                                                    <h3 class="mb-1">17</h3>
                                                </div>
