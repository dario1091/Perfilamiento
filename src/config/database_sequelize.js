const { Sequelize } = require('sequelize');


'use-strict';
//Libraries

const dotenv = require("dotenv");
dotenv.config();

//Import Controllers


const sequelize = new Sequelize(

  process.env.DATABASE,
  process.env.USER_NAME,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: process.env.DIALEC_BD,

    pool: {
      max: parseInt(process.env.MAX),
      min: parseInt(process.env.MIN),
      require: null,
      idle: null
    },
    logging: console.log,
    logging: function (str) {
      // do your own logging
      //  console.log("####################################################################11");
      //  console.log(str);
      //  console.log("####################################################################22");

    }
  }
);
var db = {};
try {
  sequelize.authenticate();
  console.log('Connection has been established successfully. sequelize===================');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.account = require('../models/account.js')(sequelize, Sequelize);
db.administrator = require('../models/administrator.js')(sequelize, Sequelize);
db.audit = require('../models/audit.js')(sequelize, Sequelize);
db.auth = require('../models/auth.js')(sequelize, Sequelize);
db.bank = require('../models/bank.js')(sequelize, Sequelize);
db.client = require('../models/client.js')(sequelize, Sequelize);
db.clientdocuments = require('../models/clientdocuments.js')(sequelize, Sequelize);
db.codes = require('../models/codes.js')(sequelize, Sequelize);
db.company_has_companysalaries = require('../models/company_has_companysalaries.js')(sequelize, Sequelize);
db.company = require('../models/company.js')(sequelize, Sequelize);
db.companymembers = require('../models/companymembers.js')(sequelize, Sequelize);
db.companysalaries = require('../models/companysalaries.js')(sequelize, Sequelize);
db.documents = require('../models/documents.js')(sequelize, Sequelize);
db.emails = require('../models/emails.js')(sequelize, Sequelize);
db.indicators = require('../models/indicators.js')(sequelize, Sequelize);
db.newclient = require('../models/newclient.js')(sequelize, Sequelize);
db.observations = require('../models/observations.js')(sequelize, Sequelize);
db.payment = require('../models/payment.js')(sequelize, Sequelize);
db.prerequestdates = require('../models/prerequestdates.js')(sequelize, Sequelize);
db.rejectionreasons = require('../models/rejectionreasons.js')(sequelize, Sequelize);
db.request = require('../models/request.js')(sequelize, Sequelize);
db.requestoutlay = require('../models/requestoutlay.js')(sequelize, Sequelize);
db.requeststate = require('../models/requeststate.js')(sequelize, Sequelize);
db.role = require('../models/role.js')(sequelize, Sequelize);
db.rolhasservices = require('../models/rolhasservices.js')(sequelize, Sequelize);
db.services = require('../models/services.js')(sequelize, Sequelize);
db.sms = require('../models/sms.js')(sequelize, Sequelize);
db.smscodes = require('../models/smscodes.js')(sequelize, Sequelize);
db.transaction = require('../models/transaction.js')(sequelize, Sequelize);
db.user = require('../models/user.js')(sequelize, Sequelize);
db.generatedbankfiles = require('../models/generatedbankfiles.js')(sequelize, Sequelize);
db.loginhistory = require('../models/loginhistory.js')(sequelize, Sequelize);
db.sabana = require('../models/sabana.js')(sequelize, Sequelize);
db.departments = require('../models/Departments.js')(sequelize, Sequelize);
db.municipalities = require('../models/Municipalities.js')(sequelize, Sequelize);
db.documentstypes = require('../models/DocumentsTypes.js')(sequelize, Sequelize);
db.baseactivos = require('../models/BaseActivos.js')(sequelize, Sequelize);
db.detailgeneratebankfile = require('../models/DetailGenerateBankFile.js')(sequelize, Sequelize);
db.loadedbankfiles = require('../models/LoadedBankFiles.js')(sequelize, Sequelize);
db.detailloadedbankfile = require('../models/DetailLoadedBankFiles.js')(sequelize, Sequelize);
db.administrationpaid = require('../models/AdministrationPaid.js')(sequelize, Sequelize);
db.requestdetails = require('../models/RequestDetail.js')(sequelize, Sequelize);
db.requestaudit = require('../models/RequestAudit.js')(sequelize, Sequelize);
db.customeraudit = require('../models/CustomerAudit.js')(sequelize, Sequelize);
db.overdraftreasons = require('../models/OverdraftReasons.js')(sequelize, Sequelize);
db.configuration = require('../models/configuration.js')(sequelize, Sequelize);



//Relations
// db.auth.belongsTo(db.user);
// db.user.hasMany(db.auth);

db.auth.belongsTo(db.user, { foreignKey: 'User_idUser' });
db.user.hasOne(db.auth, { foreignKey: 'User_idUser' });


// db.services.belongsTo(db.rolhasservices, { foreignKey: 'IdService' });
// db.rolhasservices.hasMany(db.services, { foreignKey: 'IdService' });

db.rolhasservices.belongsTo(db.services, { foreignKey: 'IdService' });
db.services.hasMany(db.rolhasservices, { foreignKey: 'IdService' });



db.audit.belongsTo(db.user);
db.user.hasMany(db.audit);

db.role.belongsTo(db.user);
db.user.hasMany(db.role);

db.loginhistory.belongsTo(db.user);
db.user.hasMany(db.loginhistory);




db.administrator.belongsTo(db.user);
db.user.hasMany(db.administrator);

db.generatedbankfiles.belongsTo(db.bank, { foreignKey: 'bank_id' });
db.bank.hasOne(db.generatedbankfiles, { foreignKey: 'bank_id' });


db.request.belongsTo(db.account, { foreignKey: 'Account_idAccount' });
db.account.hasMany(db.request, { foreignKey: 'Account_idAccount' });


db.account.belongsTo(db.client, { foreignKey: 'Client_idClient' });
db.client.hasOne(db.account, { foreignKey: 'Client_idClient' });


db.company.hasOne(db.client, { foreignKey: 'Company_idCompany' });
db.client.belongsTo(db.company, { foreignKey: 'Company_idCompany' });


db.client.hasOne(db.user, { foreignKey: 'Client_idClient' });
db.user.belongsTo(db.client, { foreignKey: 'Client_idClient' });


db.companysalaries.hasOne(db.client, { foreignKey: 'CompanySalaries_idCompanySalaries' });
db.client.belongsTo(db.companysalaries, { foreignKey: 'CompanySalaries_idCompanySalaries' });


// db.loadedbankfiles.belongsTo(db.generatedbankfiles,{foreignKey:'geba_id'});
db.generatedbankfiles.hasMany(db.loadedbankfiles, { foreignKey: 'geba_id' });
db.generatedbankfiles.hasMany(db.detailgeneratebankfile, { foreignKey: 'geba_id' });

db.detailgeneratebankfile.belongsTo(db.request, { foreignKey: 'requ_id' });

// db.request.hasMany(db.detailgeneratebankfile, { foreignKey: 'requ_id' });


db.loadedbankfiles.hasMany(db.detailloadedbankfile, { foreignKey: 'lobf_id' });

db.company.hasOne(db.user, { foreignKey: 'Company_idCompany' });
db.user.belongsTo(db.company, { foreignKey: 'Company_idCompany' });


db.companysalaries.hasOne(db.company_has_companysalaries, { foreignKey: 'CompanySalaries_idCompanySalaries' });
db.company_has_companysalaries.belongsTo(db.companysalaries, { foreignKey: 'CompanySalaries_idCompanySalaries' });



db.request.belongsTo(db.requeststate, { foreignKey: 'RequestState_idRequestState' });
db.requeststate.hasMany(db.request, { foreignKey: 'RequestState_idRequestState' });




db.requestdetails.belongsTo(db.request, { foreignKey: 'requ_id' });
db.request.hasMany(db.requestdetails, { foreignKey: 'requ_id' });


module.exports = db;

