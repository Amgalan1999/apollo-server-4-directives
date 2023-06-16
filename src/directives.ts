import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils"
import { defaultFieldResolver } from 'graphql';

export function upperDirectiveTransformer(schema, directiveName) {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            const upperDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

            if (upperDirective) {
                const { resolve = defaultFieldResolver } = fieldConfig;

                fieldConfig.resolve = async function (source, args, context, info) {
                    const result = await resolve(source, args, context, info);
                    if (typeof result === 'string') {
                        return result.toUpperCase();
                    }
                    return result;
                };
                return fieldConfig;
            }
        },
    });
}

export function getAuthorizedSchema(schema, directiveName) {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            const typeAuthDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

            if (typeAuthDirective) {
                const typeLevelPermissions = typeAuthDirective?.permissions ?? [];
                const originalResolver = fieldConfig.resolve ?? defaultFieldResolver;
                fieldConfig.resolve = (source, args, context, info) => {
                    console.log(context, "context")
                    if (context?.roles.length == 0) {
                        throw new Error("yee gg")
                    }
                    console.log(typeLevelPermissions, "permission")

                    // if (!isAuthorized(fieldPermissions, typePermissions, user)) {
                    //     throw new Error("Unauthorized");
                    // }
                    return originalResolver(source, args, context, info);
                };
                return fieldConfig;
            }
        },
    });
}