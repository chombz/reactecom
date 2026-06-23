[1mdiff --git a/src/components/frontend/auth/login.js b/src/components/frontend/auth/login.js[m
[1mindex 78305161..b4054cec 100644[m
[1m--- a/src/components/frontend/auth/login.js[m
[1m+++ b/src/components/frontend/auth/login.js[m
[36m@@ -29,66 +29,62 @@[m [mfunction Login()[m
             password: loginInput.password,[m
         };[m
 [m
[31m-        // For Sanctum SPA auth, we must get a CSRF cookie first.[m
[31m-        axios.get('/sanctum/csrf-cookie').then(response => [m
[32m+[m[32m        axios.post('/api/login', data).then(res =>[m
         {[m
[31m-            axios.post('/api/login', data).then(res => [m
[32m+[m[32m            if (res.data.status === 200)[m[41m [m
             {[m
[31m-                if (res.data.status === 200) [m
[31m-                {[m
[31m-                    // Store token and user data in local storage[m
[31m-                    localStorage.setItem('auth_token', res.data.token);[m
[31m-                    localStorage.setItem('auth_user', JSON.stringify(res.data.user));[m
[32m+[m[32m                // Store token and user data in local storage[m
[32m+[m[32m                localStorage.setItem('auth_token', res.data.token);[m
[32m+[m[32m                localStorage.setItem('auth_user', JSON.stringify(res.data.user));[m
 [m
[31m-                    Swal.fire[m
[31m-                        ({[m
[31m-                            title: "Success",[m
[31m-                            text: res.data.message,[m
[31m-                            icon: "success",[m
[31m-                            timer: 2000,[m
[31m-                            showConfirmButton: false[m
[31m-                        });[m
[32m+[m[32m                Swal.fire[m
[32m+[m[32m                    ({[m
[32m+[m[32m                        title: "Success",[m
[32m+[m[32m                        text: res.data.message,[m
[32m+[m[32m                        icon: "success",[m
[32m+[m[32m                        timer: 2000,[m
[32m+[m[32m                        showConfirmButton: false[m
[32m+[m[32m                    });[m
 [m
[31m-                    // ** This is the critical part for redirection **[m
[31m-                    if (res.data.role === 'admin') [m
[31m-                    {[m
[31m-                        // Check role from response[m
[31m-                        navigate('/admin/dashboard');[m
[31m-                    }[m
[31m-                    else [m
[31m-                    {[m
[31m-                        navigate('/'); // Redirect regular users to the homepage[m
[31m-                    }[m
[31m-                }[m
[31m-                else if (res.data.status === 401) [m
[32m+[m[32m                // ** This is the critical part for redirection **[m
[32m+[m[32m                if (res.data.role === 'admin')[m[41m [m
                 {[m
[31m-                    // Handle invalid credentials[m
[31m-                    Swal.fire[m
[31m-                        ({[m
[31m-                            title: "Login Failed",[m
[31m-                            text: res.data.message,[m
[31m-                            icon: "warning"[m
[31m-                        });[m
[32m+[m[32m                    // Check role from response[m
[32m+[m[32m                    navigate('/admin/dashboard');[m
                 }[m
                 else [m
                 {[m
[31m-                    // Handle validation errors (e.g., email or password format is wrong)[m
[31m-                    setLoginInput[m
[31m-                        ({[m
[31m-                            ...loginInput, error_list: res.data.validation_errors || {}[m
[31m-                        });[m
[32m+[m[32m                    navigate('/'); // Redirect regular users to the homepage[m
                 }[m
[31m-            }).catch(error => [m
[32m+[m[32m            }[m
[32m+[m[32m            else if (res.data.status === 401)[m[41m [m
             {[m
[31m-                // This catches network errors or other issues with the request[m
[31m-                console.error("An unexpected login error occurred:", error);[m
[32m+[m[32m                // Handle invalid credentials[m
                 Swal.fire[m
                     ({[m
[31m-                        title: "Login Error",[m
[31m-                        text: "An unexpected error occurred. Please check your connection and try again.",[m
[31m-                        icon: "error",[m
[32m+[m[32m                        title: "Login Failed",[m
[32m+[m[32m                        text: res.data.message,[m
[32m+[m[32m                        icon: "warning"[m
                     });[m
[31m-            });[m
[32m+[m[32m            }[m
[32m+[m[32m            else[m[41m [m
[32m+[m[32m            {[m
[32m+[m[32m                // Handle validation errors (e.g., email or password format is wrong)[m
[32m+[m[32m                setLoginInput[m
[32m+[m[32m                    ({[m
[32m+[m[32m                        ...loginInput, error_list: res.data.validation_errors || {}[m
[32m+[m[32m                    });[m
[32m+[m[32m            }[m
[32m+[m[32m        }).catch(error =>[m[41m [m
[32m+[m[32m        {[m
[32m+[m[32m            // This catches network errors or other issues with the request[m
[32m+[m[32m            console.error("An unexpected login error occurred:", error);[m
[32m+[m[32m            Swal.fire[m
[32m+[m[32m                ({[m
[32m+[m[32m                    title: "Login Error",[m
[32m+[m[32m                    text: "An unexpected error occurred. Please check your connection and try again.",[m
[32m+[m[32m                    icon: "error",[m
[32m+[m[32m                });[m
         });[m
     };[m
 [m
