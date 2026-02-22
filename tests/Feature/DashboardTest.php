<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Tamu (Guest) tidak boleh masuk ke dashboard dan harus dilempar ke login.
     */
    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    /**
     * Test: Admin bisa mengakses dashboard.
     */
    public function test_admin_can_access_dashboard(): void
    {
        $user = User::factory()->create(['usertype' => 'admin']);
        $response = $this->actingAs($user)->get(route('dashboard'));
        $response->assertStatus(200);
    }

    /**
     * Test: Superadmin bisa mengakses dashboard.
     */
    public function test_superadmin_can_access_dashboard(): void
    {
        $user = User::factory()->create(['usertype' => 'superadmin']);
        $response = $this->actingAs($user)->get(route('dashboard'));
        $response->assertStatus(200);
    }

    /**
     * Test: Ketua bisa mengakses dashboard.
     */
    public function test_ketua_can_access_dashboard(): void
    {
        $user = User::factory()->create(['usertype' => 'ketua']);
        $response = $this->actingAs($user)->get(route('dashboard'));
        $response->assertStatus(200);
    }

    /**
     * Test: Regular User bisa mengakses dashboard.
     */
    public function test_regular_user_can_access_dashboard(): void
    {
        $user = User::factory()->create(['usertype' => 'user']);
        $response = $this->actingAs($user)->get(route('dashboard'));
        $response->assertStatus(200);
    }

    public function test_unauthorized_usertype_is_redirected(): void
    {
        $user = User::factory()->create(['usertype' => 'unknown_role']);
        $response = $this->actingAs($user)->get(route('dashboard'));
        $response->assertRedirect();
    }
}
