interface MailConfig {
    driver: 'ethereal' | 'ses';
    defaults: {
        from: {
            email: string;
            name: string;
        };
    };
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',

    defaults: {
        from: {
            email: 'lucas@lucasleal.dev.br',
            name: 'Lucas Leal Dev',
        },
    },
} as MailConfig;
