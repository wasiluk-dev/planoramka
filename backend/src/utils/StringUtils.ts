import argon2 from 'argon2';

export default class StringUtils {
    static async hash(string: string): Promise<string> {
        return argon2.hash(string)
            .then((hashedString: string): string => {
                return hashedString;
            })
            .catch(err => {
                throw err;
            });
    }
}
