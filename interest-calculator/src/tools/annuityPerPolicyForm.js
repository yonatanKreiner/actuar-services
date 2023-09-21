const fs = require("fs");
const {
    ExternalHyperlink,
    HeadingLevel,
    ImageRun,
    Paragraph,
    patchDocument,
    PatchType,
    Table,
    TableCell,
    TableRow,
    TextDirection,
    TextRun,
    VerticalAlign,
} = require("docx");

const createTableFromPolicyData = (policy) => {
    const policyDescription = new Paragraph({
        text: `שם קופה ${policy.name}, מספר תוכנית: ${policy.id} סוג התוכנית: ${policy.type}`,
    });

    const depositsTable = new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ text: "שנת מס" })],
                        verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: "עובד לא פטור ממס" })],
                        verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: "עובד פטור ממס" })],
                        textDirection: TextDirection.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: "מעסיק לא פטור ממס" })],
                        textDirection: TextDirection.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: "מעסיק פטור ממס" })],
                        textDirection: TextDirection.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: "פיצויים לא פטור ממס" })],
                        textDirection: TextDirection.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: "פיצויים פטור ממס" })],
                        textDirection: TextDirection.CENTER,
                    }),
                ].reverse()
            }),
            ...policy.deposits.map(x => new TableRow({
                children: Object.values(x).reverse().map(column => new TableCell({
                    children: [new Paragraph({text: column.toString()})],
                    verticalAlign: VerticalAlign.CENTER,
                }))
            }))
        ]
    });

    return [policyDescription, depositsTable]
}

const getFormFromTemplate = async (data) => {
    const resultDoc = await patchDocument(fs.readFileSync('./assets/annuity_per_policy_form_template.docx'), {
        patches: {
            client_name: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(data.userDetails.name)],
            },
            client_id: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(data.userDetails.id)],
            },
            client_gender: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(data.userDetails.gender === 'male'? 'זכר':'נקבה')],
            },
            client_age: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(`${new Date().getFullYear() - new Date(data.userDetails.birthDate).getFullYear()}`)],
            },
            client_retirement: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(`${data.userDetails.retirement}`)],
            },
            annuities_per_policy: {
                type: PatchType.DOCUMENT,
                children: data.policiesTable.map(policy => createTableFromPolicyData(policy)).flat(),
            }
        }
    });

    return resultDoc;
}

module.exports = { getFormFromTemplate }