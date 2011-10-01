<?php
/**
 * No comments it's only to showoff our shiny namespaces.
 */
namespace jsconf;

class Apc {

    public function __construct() {}

    public function get($key) {
        return apc_fetch(sha1($key));
    }

    public function set($key, $value) {
        return apc_store(sha1($key), $value);
    }
}
