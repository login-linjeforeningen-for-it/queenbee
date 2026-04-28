import FormWrapper from '@components/form/wrapper'
import RuleForm from '@components/form/server/rules'
import getRule from '@utils/api/workerbee/rules/getRule'
import { createRule, updateRule } from '@components/form/actions/rules'
import { notFound } from 'next/navigation'

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string; id?: string[] }>
}) {
    const { id, slug } = await params

    if (id) {
        const rule = await getRule(Number(id[0]))
        if (typeof rule === 'object' && Object.keys(rule).length > 0) {
            if (slug === 'create') {
                return (
                    <FormWrapper
                        name='rule'
                        path='rules'
                        type='create'
                        formAction={createRule}
                    >
                        <RuleForm defaultValues={rule} />
                    </FormWrapper>
                )
            } else if (slug === 'update') {
                return (
                    <FormWrapper
                        name='rule'
                        path='rules'
                        type='update'
                        id={id[0]}
                        formAction={updateRule}
                    >
                        <RuleForm defaultValues={rule} />
                    </FormWrapper>
                )
            }
        }
    } else if (slug === 'create') {
        return (
            <FormWrapper
                name='rule'
                path='rules'
                type='create'
                formAction={createRule}
            >
                <RuleForm />
            </FormWrapper>
        )
    }

    notFound()
}
