export type Index<T> = {
    [index: number]: T
}

/**
 * Represents cached resolutions interface.
 *
 * @remarks
 * Resolutions could be retrieved by name. The value of the name is computed as follows
 * (from highest to lowest priority):
 *
 * 1. `name` parameter for the `cache` method specified during resolution.
 *
 * 2. `name` parameter used for named registrations.
 *
 * 3. service parameter representing an object with the `name` property.
 *
 * 4. service parameter representing a string object
 *
 * @public
 */
export interface ICache {
    /**
     * Retrieves resolution interface directly via name.
     * Returns service resolution instance or undefined if no resolution found
     */
    readonly instance: {
        [name: string]: any
    },

    /**
     * Resolves an instance of a service
     * @param name - service resolution name
     * @returns - an instance of service resolution.
     * Throws {@link ResolutionError} when no resolution found
     */
    resolve<R>(name: string): R
}

export type IndexedCollection<T> = Index<T> & {
    [name: string]: T
}
