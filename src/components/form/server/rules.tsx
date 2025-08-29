import RuleFormInputsClient from '../client/rules'

export default function RuleFormInputs({
    defaultValues,
    parent,
}: {
    defaultValues?: GetRuleProps
    parent?: { preview?: boolean }
}) {
    return <RuleFormInputsClient
        defaultValues={defaultValues}
        preview={parent?.preview}
    />
}
