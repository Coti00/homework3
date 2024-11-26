const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    company_name:{
        type: String,
        required: true
    },
    company_type:{
        type: String,
        required: true
    },
    website:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    employee_count: {
        type: mongoose.Schema.Types.Mixed, // String과 Number 모두 허용
    },
    industry:{
        type: String,
    },
    ceo_name:{
        type: String,
    },
    description:{
        type: String,
    },
    establish_date:{
        type: String,
    },
    revenue:{
        type: Number,
    },
    salary:{
        type: mongoose.Schema.Types.Mixed,
    }
})

const Company = mongoose.model("CompanyInfo", companySchema);


module.exports = Company;