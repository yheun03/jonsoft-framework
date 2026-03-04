<template>
    <div class="page-users">
        <h1>Users</h1>

        <div v-if="pending">loading...</div>

        <ul v-else>
            <li v-for="u in users" :key="u.id">
                {{ u.name }} <small v-if="u.email">({{ u.email }})</small>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { userService } from '@/services/user.service'
import type { User } from '@/types/api/user'

const { data: users, pending } = await useAsyncData<User[]>(
    'users',
    () => userService.getUsers(),
    { default: () => [] }
)
</script>