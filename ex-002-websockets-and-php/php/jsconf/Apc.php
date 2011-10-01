<?php
/**
 * No comments it's only to showoff our shiny namespaces.
 */
namespace jsconf;

class Apc {
 
    public function __construct() {}

    /**
     * Get a key from the cache.
     * 
     * This method is used to get a key from the cache.
     * 
     * @param  string $key The key to retreive.
     * @return mixed       Either a boolean for the textual value of
     *                     the cached key or false if nothing is found.
     */
    public function get($key) {
        return apc_fetch(sha1($key));
    }

    /**
     * Set a new value for a key in the cache.
     * 
     * This method is used to insert a new value in the cache
     * for each retrieval afterwards.
     * 
     * @param  string $key   The key to store.
     * @param  mixed  $value The value to store in the cache
     * @return bool          The result of the operationr.
     */
    public function set($key, $value) {
        return apc_store(sha1($key), $value);
    }
}
