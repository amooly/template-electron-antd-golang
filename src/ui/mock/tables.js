export default {
    policyNo: {
        name: "保单号",
        field: "policyNo",
        dbName: "ins",
        parse: {
            tableIndex: "${no}.subString(${no}.length-4).format('_%4s')",
            dbIndex: "${no}.subString(${no}.length-4)/64.format('%2s')"
        },
        tableList: {
            bx_policy: {
                name: "bx_policy",
                annotation: "保单",
                checked: true
            },
            bx_claim: {
                name: "bx_claim",
                annotation: "理赔单"
            },
            bx_person: {
                name: "bx_person",
                annotation: "干系人"
            },
            bx_bill: {
                name: "bx_bill",
                annotation: "账单"
            },
            bx_fund_instruct: {
                name: "bx_fund_instruct",
                annotation: "资金指令"
            },
        }
    },
    claim_report_no: {
        name: "报案单号",
        field: "claim_report_no",
        tableList: {
            bx_claim_report: {
                name: "bx_claim_report",
                annotation: "报案单"
            },
            bx_progress: {
                name: "bx_progress",
                annotation: "报案进度",
            },
            bx_attachment: {
                name: "bx_attachment",
                annotation: "报案附件",
                indexName: "ins_biz_no"
            }
        }
    },
    claim_no: {
        name: "理赔单号",
        field: "claim_no",
        tableList: {
            bx_claim: {
                name: "bx_claim",
                annotation: "理赔单"
            },
            bx_claim_attachment: {
                name: "bx_claim_attachment",
                annotation: "赔案单附件"
            },
            ins_accept_task: {
                name: "ins_accept_task",
                annotation: "核赔任务",
                indexName: "task_biz_id"
            }
        }
    },
    out_biz_no: {
        name: "外部业务单号",
        field: "out_biz_no",
        tableList: {
            bx_policy: {
                name: "bx_policy",
                annotation: "保单"
            },
            bx_claim_report: {
                name: "bx_claim_report",
                annotation: "报案单"
            },
            bx_claim: {
                name: "bx_claim",
                annotation: "理赔单"
            },
            bx_idempotent_control: {
                name: "bx_idempotent_control",
                annotation: "幂等表",
                field: "operation_key",
                sql: "select * from ins${dbIndex}.${tableIndex} where operation_key like '%${no}%'"
            }
        }
    }
};